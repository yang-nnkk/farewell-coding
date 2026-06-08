# 苍穹管理系统

基于 Vue 3 + Go (Gin) 的前后端分离电商后台管理系统。

## 技术栈

### 前端
- Vue 3.5 + TypeScript 5.9
- Vite 7.3
- Element Plus 2.13
- Pinia 3.0 (状态管理)
- Vue Router 4.6 (动态路由 + 权限过滤)
- ECharts 5.4 (数据可视化)
- DataV (大屏展示)

### 后端
- Go 1.20 + Gin 1.10
- MySQL 8.0 (sqlx)
- JWT 认证
- RBAC 权限模型
- 雪花算法 ID 生成
- Uber Zap 日志

## 功能模块

- **登录认证** — 用户名密码登录，JWT Token 鉴权
- **权限管理 (ACL)** — 用户管理、角色管理、菜单/权限管理（按钮级权限）
- **商品管理** — 品牌管理、属性管理（三级分类）、SPU 管理、SKU 管理
- **数据可视化** — 大屏展示（中国地图 + ECharts 图表 + DataV 组件）
- **主题系统** — 5 套预设主题 + 自定义颜色 + 暗色模式

## 快速开始

### 环境要求

- Node.js >= 18
- Go >= 1.20
- MySQL >= 8.0

### 1. 数据库初始化

```bash
mysql -u root -p < vue3_admin_backend/init-sql/init.sql
```

### 2. 启动后端

```bash
cd vue3_admin_backend

# 设置数据库密码（或直接编辑 conf/config.yaml）
export VUE3_ADMIN_MYSQL_PASSWORD="your_password"

# 启动
go run main.go -f conf/config.yaml
```

后端默认运行在 `http://127.0.0.1:10086`

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`

### 4. 访问

打开浏览器访问 `http://localhost:5173`

默认账号：`admin` / `root123`

## Docker 部署

```bash
cd vue3_admin_backend
docker-compose up -d
```

## 项目结构

```
├── frontend/                  # 前端 Vue 3 项目
│   ├── src/
│   │   ├── api/              # API 接口定义
│   │   ├── components/       # 公共组件
│   │   ├── layout/           # 布局组件
│   │   ├── router/           # 路由配置
│   │   ├── stores/           # Pinia 状态管理
│   │   ├── styles/           # 全局样式
│   │   ├── utils/            # 工具函数
│   │   └── views/            # 页面视图
│   └── vite.config.ts
│
├── vue3_admin_backend/         # 后端 Go 项目
│   ├── conf/                 # 配置文件
│   ├── controller/           # 控制器层
│   ├── dao/mysql/            # 数据访问层
│   ├── model/                # 数据模型
│   ├── middlewares/          # 中间件
│   ├── pkg/                  # 工具包
│   ├── router/               # 路由定义
│   ├── service/              # 业务逻辑层
│   └── init-sql/             # 数据库初始化脚本
│
└── backend-manager.sh         # 后端管理脚本
```

## License

MIT
