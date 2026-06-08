#!/bin/bash

# 苍穹管理系统后端一键管理脚本
# 使用方法: ./backend-manager.sh [start|stop|restart|status]

# 配置变量
BACKEND_DIR="vue3_admin_backend"
CONFIG_FILE="conf/config.yaml"
EXECUTABLE="vue3_admin.exe"
PORT=10086
LOG_FILE="output.log"
GO_PATH="/d/Go/bin"

# 设置环境变量
export PATH="$PATH:$GO_PATH"
export GOPROXY="https://goproxy.cn,direct"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 函数：检查服务是否运行
check_running() {
    if netstat -ano 2>/dev/null | grep -q ":$PORT.*LISTENING"; then
        PID=$(netstat -ano 2>/dev/null | grep ":$PORT.*LISTENING" | awk '{print $5}' | head -1)
        echo "$PID"
        return 0
    else
        echo ""
        return 1
    fi
}

# 函数：启动服务
start_service() {
    print_info "检查服务状态..."
    PID=$(check_running)

    if [ -n "$PID" ]; then
        print_warning "服务已在运行 (PID: $PID)"
        return 1
    fi

    # 进入后端目录
    cd "$BACKEND_DIR" || {
        print_error "无法进入目录: $BACKEND_DIR"
        return 1
    }

    print_info "正在启动后端服务..."
    print_info "端口: $PORT"
    print_info "配置文件: $CONFIG_FILE"
    print_info "日志文件: $LOG_FILE"

    # 启动服务（后台运行）
    ./$EXECUTABLE -f "$CONFIG_FILE" > "$LOG_FILE" 2>&1 &
    SERVER_PID=$!

    # 等待服务启动
    sleep 3

    # 检查是否启动成功
    if check_running > /dev/null; then
        print_success "后端服务启动成功!"
        print_success "服务PID: $SERVER_PID"
        print_success "监听端口: $PORT"
        print_success "日志文件: $BACKEND_DIR/$LOG_FILE"
        print_info "测试接口: curl http://localhost:$PORT/health"
        print_info "API文档: http://localhost:$PORT/swagger/index.html"
        print_info "登录测试: curl -X POST http://localhost:$PORT/admin/acl/index/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":\"root123\"}'"
    else
        print_error "服务启动失败，请检查日志: $BACKEND_DIR/$LOG_FILE"
        tail -10 "$LOG_FILE"
        return 1
    fi
}

# 函数：停止服务
stop_service() {
    print_info "正在停止后端服务..."

    PID=$(check_running)

    if [ -z "$PID" ]; then
        print_warning "服务未在运行"
        return 0
    fi

    print_info "找到服务进程: PID=$PID"

    cmd //c "taskkill /F /PID $PID" >/dev/null 2>&1
    sleep 2

    if ! check_running > /dev/null; then
        print_success "服务已停止"
    else
        print_error "停止服务失败，请手动检查进程"
        return 1
    fi
}

# 函数：重启服务
restart_service() {
    stop_service
    sleep 2
    start_service
}

# 函数：查看状态
show_status() {
    print_info "=== 后端服务状态检查 ==="

    PID=$(check_running)

    if [ -n "$PID" ]; then
        print_success "✅ 服务正在运行"
        print_info "   PID: $PID"
        print_info "   端口: $PORT"
        print_info "   启动时间: $(ps -p $PID -o lstart= 2>/dev/null || echo '未知')"

        # 测试健康检查
        print_info "\n=== 接口测试 ==="
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/health 2>/dev/null | grep -q "200"; then
            print_success "   健康检查: ✅ 正常"
        else
            print_warning "   健康检查: ⚠️ 异常"
        fi

        # 测试登录接口
        print_info "   登录接口测试中..."
        RESPONSE=$(curl -s -X POST http://localhost:$PORT/admin/acl/index/login \
            -H "Content-Type: application/json" \
            -d '{"username":"admin","password":"root123"}' \
            -w "\n%{http_code}")

        HTTP_CODE=$(echo "$RESPONSE" | tail -1)
        RESPONSE_BODY=$(echo "$RESPONSE" | head -1)

        if [ "$HTTP_CODE" = "200" ]; then
            print_success "   登录接口: ✅ 正常"
            print_info "   响应示例: $(echo $RESPONSE_BODY | cut -c1-50)..."
        else
            print_error "   登录接口: ❌ 异常 (HTTP $HTTP_CODE)"
        fi

        # 显示日志文件大小
        if [ -f "$BACKEND_DIR/$LOG_FILE" ]; then
            LOG_SIZE=$(wc -l < "$BACKEND_DIR/$LOG_FILE" 2>/dev/null || echo "0")
            print_info "\n=== 日志信息 ==="
            print_info "   日志文件: $BACKEND_DIR/$LOG_FILE"
            print_info "   日志行数: $LOG_SIZE"
            print_info "   最后5行日志:"
            tail -5 "$BACKEND_DIR/$LOG_FILE" 2>/dev/null || print_warning "   无法读取日志文件"
        fi

    else
        print_error "❌ 服务未运行"
        print_info "   端口 $PORT 未监听"
    fi

    print_info "\n=== 数据库连接测试 ==="
    DB_PASS="${VUE3_ADMIN_MYSQL_PASSWORD:-}"
    if mysql -u root -p"${DB_PASS}" -e "USE vue3_admin; SELECT COUNT(*) FROM user;" 2>/dev/null | grep -q "[0-9]"; then
        print_success "   数据库连接: ✅ 正常"
        USER_COUNT=$(mysql -u root -p"${DB_PASS}" -e "USE vue3_admin; SELECT COUNT(*) FROM user;" 2>/dev/null | tail -1)
        print_info "   用户数量: $USER_COUNT"
    else
        print_error "   数据库连接: ❌ 异常"
    fi
}

# 函数：显示帮助信息
show_help() {
    echo -e "${BLUE}苍穹管理系统后端一键管理脚本${NC}"
    echo ""
    echo "使用方法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  start    启动后端服务"
    echo "  stop     停止后端服务"
    echo "  restart  重启后端服务"
    echo "  status   查看服务状态"
    echo "  help     显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 start    # 启动服务"
    echo "  $0 status   # 查看状态"
    echo "  $0 stop     # 停止服务"
    echo ""
    echo "默认配置:"
    echo "  端口: $PORT"
    echo "  配置文件: $BACKEND_DIR/$CONFIG_FILE"
    echo "  执行文件: $BACKEND_DIR/$EXECUTABLE"
    echo "  默认用户: admin/root123, editor/123456"
}

# 主程序
case "$1" in
    start)
        start_service
        ;;
    stop)
        stop_service
        ;;
    restart)
        restart_service
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        if [ -z "$1" ]; then
            show_help
        else
            print_error "未知命令: $1"
            echo ""
            show_help
            exit 1
        fi
        ;;
esac

exit 0