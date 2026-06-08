<template>
    <div class="role-container">
        <el-card>
            <el-form inline>
                <el-form-item label="角色名称">
                    <el-input
                        v-model="searchRolenameKeyword"
                        placeholder="请输入角色名称"
                        style="width: 300px"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch" size="small">搜索</el-button>
                    <el-button type="default" @click="handleReset" size="small">重置</el-button>
                </el-form-item>
            </el-form>
            <el-card style="height: 700px; border-radius: 10px">
                <el-button v-has="'btn.Role.add'" type="primary" size="small" @click="handleAddRole">添加角色</el-button>
                <!-- 角色列表展示区域 -->
                <el-table :data="roleList" style="width: 100%; height: 90%; margin-top: 10px">
                    <el-table-column label="#" align="center" width="100" type="index"></el-table-column>
                    <el-table-column label="id" align="center" width="150" prop="id"></el-table-column>
                    <el-table-column
                        label="角色名称"
                        prop="roleName"
                        align="center"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        label="创建时间"
                        prop="createTime"
                        align="center"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        label="更新时间"
                        prop="updateTime"
                        align="center"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column label="操作" align="center" width="300">
                        <template #="{ row, index }">
                            <el-button
                                v-has="'btn.Role.assgin'"
                                type="primary"
                                size="small"
                                @click="handleAssignPermissions(row)"
                                :disabled="row.id === 1"
                                >配置</el-button
                            >
                            <el-button
                                v-has="'btn.Role.update'"
                                type="primary"
                                size="small"
                                @click="handlerEditRoleInfo(row)"
                                :disabled="row.id === 1"
                                >编辑</el-button
                            >
                            <el-popconfirm title="确定删除这个角色吗？" @visible-change="onPopconfirmVisibleChange">
                                <template #reference>
                                    <el-button
                                        v-has="'btn.Role.remove'"
                                        type="danger"
                                        size="small"
                                        @click="handlerDeleteRole"
                                        :disabled="row.id === 1"
                                        >删除</el-button
                                    >
                                </template>
                                <template #actions="{ confirm, cancel }">
                                    <el-button size="small" @click="cancel">算了</el-button>
                                    <el-button
                                        type="danger"
                                        size="small"
                                        :disabled="!canDelete"
                                        @click="handlerSureDelete(row, confirm)"
                                    >
                                        {{ canDelete ? "删除" : delayTime }}
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    background
                    size="small"
                    :total="total"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next, jumper, ->, total"
                    style="margin-top: 10px"
                ></el-pagination>
            </el-card>
        </el-card>

        <!-- 添加或编辑角色对话框 -->
        <el-dialog
            :title="title"
            v-model="showAddOrEditRoleDialog"
            width="500px"
            center
            @close="clearAddOrEditRoleInfo"
        >
            <!-- 对话框内容 -->
            <el-form
                label-position="left"
                label-width="100px"
                ref="addOreditRoleRef"
                :rules="rules"
                :model="addOrEditRoleForm"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addOrEditRoleForm.roleName" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="addOrEditRoleForm.remark" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item style="margin-top: 20px">
                    <div style="width: 100%; text-align: right">
                        <el-button type="primary" size="small" @click="handlerCancelAddrole">取消</el-button>
                        <el-button type="primary" size="small" @click="validateForm(addOreditRoleRef)">确定</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 分配角色的菜单按钮等功能的对话框 -->
        <el-drawer title="分配权限" v-model="showAssignPermissionsDrawer" size="30%" @close="clearCurrentRoleInfo">
            <!-- 对话框内容 -->
            <template #header>
                <div style="text-align: center">分配权限</div>
            </template>
            <template #default>
                <p>{{ currentRoleInfo?.roleName }}</p>
                <el-tree-select
                    v-model="selectedPermissions"
                    :data="allPermissions"
                    :props="{ label: 'name', children: 'children' }"
                    value-key="id"
                    multiple
                    show-checkbox
                    node-key="id"
                    style="margin-top: 20px"
                ></el-tree-select>
            </template>
            <template #footer>
                <div style="text-align: right">
                    <el-button type="primary" size="small" @click="handlerCancelAssignPermission">取消</el-button>
                    <el-button type="primary" size="small" @click="handlerConfirmAssignPermission">确定</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { RoleData, GetRoleListResponseData, PermissionData } from "@/api/acl/role/type.ts";
import {
    reqGetRoleList,
    reqAddRole,
    reqGetRolePermission,
    reqAssignRolePermission,
    reqUpdateRoleInfo,
    reqDelteRole,
} from "@/api/acl/role/index.ts";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";

enum Title {
    ADDROLE = "添加角色",
    EDITROLE = "修改角色",
}

// 搜索角色名称关键词
const searchRolenameKeyword = ref<string>("");
// 角色列表数据
const roleList = ref<RoleData[]>([]);
// 总数居条数
const total = ref<number>(0);
// 一页显示多少条
const pageSize = ref<number>(13);

// pagination相关--当前页码
const currentPage = ref<number>(1);

// 添加角色对话框显示状态
const showAddOrEditRoleDialog = ref<boolean>(false);

// 分配权限对话框显示状态
const showAssignPermissionsDrawer = ref<boolean>(false);

// 添加用户信息收集
const addOrEditRoleForm = ref<RoleData>({
    roleName: "",
    remark: "",
});
const title = ref<string>("");

// 配置角色信息收集
const currentRoleInfo = ref<{ roleName: string; id: number }>();
// 所有权限
const allPermissions = ref<PermissionData[]>([]);
// 已选中的权限id列表
const selectedPermissions = ref<number[]>([]);

// 添加或修改角色的表单实例
const addOreditRoleRef = ref<FormInstance>();

const rules = ref<FormRules<RoleData>>({
    roleName: [
        { required: true, message: "字段必须填", trigger: "blur" },
        { min: 2, max: 8, message: "长度在2-8之间", trigger: "blur" },
    ],
    remark: [{ required: true, message: "字段必须填", trigger: "blur" }],
});
// 删除延迟
const canDelete = ref<boolean>(false);
const delayTime = ref<number>(5);

// 获取角色列表数据的函数
const getRoleList = async (page: number = 1, roleName?: string) => {
    try {
        const response: GetRoleListResponseData = await reqGetRoleList(page, pageSize.value, roleName);
        if (response.code === 200) {
            roleList.value = response.data.records;
            total.value = response.data.total;
        } else {
            ElMessage.error("获取角色列表失败");
        }
    } catch (error) {
        ElMessage.error("获取角色列表失败");
    }
};

// 发起搜索请求
const getSearchRoleList = async (page: number = 1) => {
    try {
        const response: GetRoleListResponseData = await reqGetRoleList(
            page,
            pageSize.value,
            searchRolenameKeyword.value,
        );
        if (response.code === 200) {
            roleList.value = response.data.records;
            total.value = response.data.total;
        } else {
            ElMessage.error("搜索角色列表失败");
        }
    } catch (error) {
        ElMessage.error("搜索角色列表失败");
    }
};
// 搜索按钮点击事件
const handleSearch = () => {
    if (searchRolenameKeyword.value.trim() === "") {
        return;
    } else {
        getSearchRoleList();
    }
};

// 重置按钮点击事件
const handleReset = () => {
    searchRolenameKeyword.value = "";
    getRoleList();
};

const clearAddOrEditRoleInfo = () => {
    addOrEditRoleForm.value = {
        roleName: "",
        remark: "",
    };
};

// 添加角色按钮点击事件
const handleAddRole = () => {
    // 显示添加角色对话框
    showAddOrEditRoleDialog.value = true;
    // 配置标题
    title.value = Title.ADDROLE;
};

// 表单验证函数
const validateForm = async (Form: FormInstance | undefined) => {
    if (!Form) return false;
    await Form.validate((valid, fields) => {
        if (valid) {
            handleAddOrEditRoleSubmit();
        }
    });
};

// dialog确定新增角色
const handleAddOrEditRoleSubmit = async () => {
    try {
        const response =
            title.value === Title.ADDROLE
                ? await reqAddRole(addOrEditRoleForm.value)
                : await reqUpdateRoleInfo(addOrEditRoleForm.value);
        if (response.code === 200) {
            ElMessage.success(title.value === Title.ADDROLE ? "添加角色成功" : "修改角色成功");
            // 关闭对话框
            showAddOrEditRoleDialog.value = false;
            // 刷新角色列表
            getRoleList(currentPage.value);
        } else {
            ElMessage.error(title.value === Title.ADDROLE ? "添加角色失败" : "修改该角色失败");
        }
    } catch (error) {
        ElMessage.error(title.value === Title.ADDROLE ? "添加角色失败" : "修改该角色失败");
    } finally {
        // 清空表单数据和标题
        title.value = "";
        addOrEditRoleForm.value = {
            roleName: "",
            remark: "",
        };
    }
};

// dialog取消新增角色
const handlerCancelAddrole = () => {
    // 关闭对话框
    showAddOrEditRoleDialog.value = false;
    // 清空标题
    title.value = "";
    // 清空表单数据
    clearAddOrEditRoleInfo();
};

// 配置按钮点击事件
const handleAssignPermissions = async (row: RoleData) => {
    // 显示分配权限对话框
    showAssignPermissionsDrawer.value = true;
    // 设置当前角色信息
    currentRoleInfo.value = { roleName: row.roleName, id: row.id as number };
    // 获取当前角色的权限列表（roleId 决定返回的 select 字段标识该角色已有的权限）
    try {
        const response = await reqGetRolePermission(row.id as number);
        if (response.code === 200) {
            allPermissions.value = response.data;
            // 根据 select 字段回显已分配的权限
            selectedPermissions.value = getSelectedPermissionIds(response.data);
        } else {
            ElMessage.error("获取角色权限列表失败");
        }
    } catch (error) {
        ElMessage.error("获取角色权限列表失败");
    }
};

// 递归收集已选中的权限 id（select 为 true 的叶子节点）
const getSelectedPermissionIds = (permissions: PermissionData[]): number[] => {
    const ids: number[] = [];
    permissions.forEach((perm) => {
        if (perm.select) {
            ids.push(perm.id);
        }
        if (perm.children?.length) {
            ids.push(...getSelectedPermissionIds(perm.children));
        }
    });
    return ids;
};

// 清空当前角色信息
const clearCurrentRoleInfo = () => {
    currentRoleInfo.value = { roleName: "", id: 0 };
    allPermissions.value = [];
    selectedPermissions.value = [];
};

// 取消分配权限
const handlerCancelAssignPermission = () => {
    showAssignPermissionsDrawer.value = false;
    clearCurrentRoleInfo();
};

// 确定分配角色权限请求
const sureAssignRolePermission = async (id: number, permissionIds: number[]) => {
    // 实现分配角色权限的逻辑
    try {
        // 这里可以调用一个接口来提交分配权限的请求，传递当前角色id和已选中的权限id列表
        const response = await reqAssignRolePermission(id, permissionIds);
        if (response.code === 200) {
            ElMessage.success("分配权限成功");
        } else {
            ElMessage.error("分配权限失败");
        }
    } catch (error) {
        ElMessage.error("分配权限失败");
    } finally {
        showAssignPermissionsDrawer.value = false;
        clearCurrentRoleInfo();
    }
};

// 确认分配权限按钮点击事件
const handlerConfirmAssignPermission = async () => {
    // 自动补全所有父级 ID，确保路由层级完整
    const completeIds = fillParentIds(selectedPermissions.value, allPermissions.value);
    await sureAssignRolePermission(currentRoleInfo.value?.id as number, completeIds);
};

// 递归补全父级 ID：对于每个选中的节点，把它所有祖先节点的 ID 也加上
const fillParentIds = (selectedIds: number[], tree: PermissionData[]): number[] => {
    const idSet = new Set(selectedIds);
    // 建立 id -> pid 的映射
    const idToPid = new Map<number, number>();
    const buildMap = (nodes: PermissionData[]) => {
        nodes.forEach((node) => {
            if (node.children?.length) {
                node.children.forEach((child) => idToPid.set(child.id, node.id));
                buildMap(node.children);
            }
        });
    };
    buildMap(tree);
    // 对每个选中的 id，向上追溯所有祖先
    const result = new Set(idSet);
    idSet.forEach((id) => {
        let pid = idToPid.get(id);
        while (pid !== undefined) {
            result.add(pid);
            pid = idToPid.get(pid);
        }
    });
    return Array.from(result);
};

// 编辑角色信息
const handlerEditRoleInfo = (row: RoleData) => {
    // 显示dialog
    showAddOrEditRoleDialog.value = true;
    // 配置标题
    title.value = "修改角色";
    // 配置info数据
    addOrEditRoleForm.value.roleName = row.roleName;
    addOrEditRoleForm.value.remark = row.remark;
    addOrEditRoleForm.value.id = row.id;
};

// 删除角色按钮点击事件
let timer: ReturnType<typeof setInterval> | null = null;
const handlerDeleteRole = () => {
    canDelete.value = false;
    delayTime.value = 5;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        delayTime.value--;
        if (delayTime.value <= 0) {
            clearInterval(timer!);
            timer = null;
            canDelete.value = true;
        }
    }, 1000);
};

// 确定删除
const handlerSureDelete = async (row: RoleData, confirm: Function) => {
    try {
        const deleteResponse = await reqDelteRole(row.id as number);
        if (deleteResponse.code === 200) {
            // 提示信息删除成功
            ElMessage({
                type: "success",
                message: "删除成功",
            });
            // 重新拉取数据
            getRoleList(currentPage.value);
        } else {
            ElMessage({
                type: "error",
                message: "删除失败，请稍后重试",
            });
        }
    } catch {
        ElMessage({
            type: "error",
            message: "删除失败，请稍后重试",
        });
    } finally {
        confirm();
    }
};

// popconfirm关闭时清理定时器
const onPopconfirmVisibleChange = (visible: boolean) => {
    if (!visible) {
        if (timer) clearInterval(timer);
        timer = null;
        canDelete.value = false;
        delayTime.value = 5;
    }
};

// 分页组件页码改变事件
const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    getRoleList(page, searchRolenameKeyword.value.trim() === "" ? undefined : searchRolenameKeyword.value);
};

// 组件挂载时获取角色列表数据
onMounted(async () => {
    await getRoleList();
});

// 组件卸载时清理资源
onUnmounted(() => {
    // 其他清理搜索关键词
    searchRolenameKeyword.value = "";
    // 其他清理角色列表数据
    roleList.value = [];
    // 其他清理总数
    total.value = 0;
    // 其他清理当前页码
    currentPage.value = 1;
    // 其他清理添加角色表单数据
    addOrEditRoleForm.value = {
        roleName: "",
        remark: "",
    };
    // 其他清理当前角色信息
    clearCurrentRoleInfo();
    // 其他清理所有权限列表数据
    allPermissions.value = [];
});
</script>

<style scoped></style>
