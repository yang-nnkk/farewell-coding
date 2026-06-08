<template>
    <div class="acl-user-container">
        <el-card>
            <el-form inline>
                <el-form-item label="用户名">
                    <el-input
                        v-model="searchKey"
                        type="text"
                        placeholder="搜索的用户名"
                        style="width: 300px"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="handlerSearch">搜索</el-button>
                    <el-button type="default" size="small" @click="handlerReset">重置</el-button>
                </el-form-item>
            </el-form>
            <el-card>
                <el-row style="margin: 10px">
                    <el-button v-has="'btn.User.add'" type="primary" size="small" @click="handlerAddUser">添加</el-button>
                    <el-button v-has="'btn.User.remove'" type="danger" size="small" @click="removeMultipleUsers">批量删除</el-button>
                </el-row>
                <el-table virtual style="height: 600px" :data="userInfo" @select="handlerSelect">
                    <el-table-column
                        type="selection"
                        :selectable="selectable"
                        align="center"
                        width="50"
                    ></el-table-column>
                    <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                    <el-table-column prop="id" label="id" align="center"></el-table-column>
                    <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                    <el-table-column prop="name" label="昵称" align="center"></el-table-column>
                    <el-table-column prop="roleName" label="角色组" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="280">
                        <template #="{ row, index }">
                            <el-button
                                v-has="'btn.User.assgin'"
                                size="small"
                                type="primary"
                                @click="HandlerAllocateRole(row)"
                                :disabled="row.id === 1"
                            >
                                <span class="iconfont icon-User" style="font-size: 10px">分配角色</span>
                            </el-button>
                            <el-button
                                v-has="'btn.User.update'"
                                size="small"
                                type="warning"
                                @click="handlerEditUser(row)"
                                :disabled="row.id === 1"
                            >
                                <span class="iconfont icon-xiugai" style="font-size: 10px">修改角色</span>
                            </el-button>
                            <el-popconfirm :title="`确定要删除 ${row.name.toString()} 吗？`" width="300">
                                <template #reference>
                                    <el-button v-has="'btn.User.remove'" size="small" type="danger" :disabled="row.id === 1">
                                        <span class="iconfont icon-shanchu" style="font-size: 10px">删除角色</span>
                                    </el-button>
                                </template>
                                <template #actions="{ confirm, cancel }">
                                    <el-button type="primary" size="small" @click="cancel">算了</el-button>
                                    <el-button type="danger" size="small" @click="removeUser(row, confirm)"
                                        >删除</el-button
                                    >
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-model:current-page="pageNo"
                    size="small"
                    background
                    @change="handlerChangePage"
                    layout="prev, pager, next, ->, total"
                    v-model:page-size="limit"
                    :total="total"
                    class="mt-4"
                    style="margin: 20px"
                ></el-pagination>
            </el-card>
        </el-card>

        <!-- 添加或编辑用户抽屉 -->
        <el-drawer v-model="addOrEditUserdrawerShow" @close="clearUserInfo">
            <template #header>
                <h1 style="text-align: center; font-size: 14px">{{ drawerTitle }}</h1>
            </template>
            <template #default>
                <el-form label-width="80" label-position="left" :model="addOrEditUserInfo" :rules="rule" ref="FormRef">
                    <el-form-item label="用户名" prop="username">
                        <el-input placeholder="请输入用户名" v-model="addOrEditUserInfo.username"></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="name">
                        <el-input placeholder="请输入用户昵称" v-model="addOrEditUserInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" v-if="isAddUser()">
                        <el-input type="password" v-model="addOrEditUserInfo.password"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button size="small" type="primary" @click="handlerCancelEditUser">取消</el-button>
                <el-button size="small" type="primary" @click="validateForm(FormRef)">确定</el-button>
            </template>
        </el-drawer>
        <!-- 分配角色抽屉 -->
        <el-drawer v-model="allocateRoleDrawerShow">
            <template #header>
                <h1 style="text-align: center; font-size: 14px">分配角色</h1>
            </template>
            <template #default>
                <el-form label-width="80" label-position="left">
                    <el-form-item label="用户名" label-width="80">
                        <el-input v-model="allocateRoleData.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="角色" label-width="80">
                        <div style="display: flex; flex-direction: column">
                            <el-checkbox
                                v-model="checkAll"
                                :indeterminate="isIndeterminate"
                                @change="handlerCheckAllChange"
                                >全选</el-checkbox
                            >
                            <el-checkbox-group
                                v-model="checkedRoleList"
                                @change="handlerCheckedRoleChange"
                                id="roleCheckboxGroup"
                            >
                                <el-checkbox
                                    v-for="role in rolesList"
                                    :key="role.id"
                                    :value="role"
                                    :label="role.roleName"
                                    style="font-weight: normal; font-size: 14px"
                                ></el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button size="small" type="primary" @click="HandlerCancelAllocateRole">取消</el-button>
                <el-button size="small" type="primary" @click="HandlerConfirmAllocateRole">确定</el-button>
            </template>
        </el-drawer>

        <!-- 批量删除dialog -->
        <el-dialog v-model="batchRemoveDialogShow" title="批量删除" width="30%">
            <template #header><p style="color: red; font-weight: bold; text-align: center">请谨慎操作！</p></template>
            <template #default>
                <el-tag v-for="user in checkedUserInfo" :key="user.id" style="margin: 5px">{{ user.username }}</el-tag>
            </template>
            <template #footer>
                <el-button size="small" type="primary" @click="cancelBatchRemoveUser">取消</el-button>
                <el-button size="small" type="danger" @click="handlerBatchRemoveUser">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, onUnmounted } from "vue";
import type {
    User,
    AddUserDataForm,
    AllocateRoleData,
    Role,
    AllRolesResponse,
    setRoleData,
} from "@/api/acl/user/type.ts";
import { reqAddOrEditUser, reqDeleteUser, reqUserInfo, reqAllRole, reqSetRole } from "@/api/acl/user/index.ts";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import type { CheckboxValueType } from "element-plus";

// 当前页面
const pageNo = ref<number>(1);
// 总页数
const total = ref<number>(0);
// 每页数据展示条数
const limit = ref<number>(13);
// 用户信息
const userInfo = ref<User[]>();

// 添加或者新增用户相关
const addOrEditUserdrawerShow = ref<boolean>(false);
const drawerTitle = ref<string>("");
// 引用表单
const FormRef = ref<FormInstance>();
const addOrEditUserInfo = ref<AddUserDataForm>({
    id: "",
    username: "",
    name: "",
    password: "",
});

// 分配角色抽屉相关
const allocateRoleDrawerShow = ref<boolean>(false);
const allocateRoleData = ref<AllocateRoleData>({
    id: "",
    username: "",
});

// admin不可选
const selectable = (row: User) => {
    return row.username !== "admin";
};

// 全选
const checkAll = ref<boolean>(false);
// 角色列表
const rolesList = ref<Role[]>([]);
// 设置全选和半选状态
const isIndeterminate = ref<boolean>(true);
// 已经选择的角色列表
const checkedRoleList = ref<Role[]>([]);
// 分配用户的角色数据
const setRoleData = ref<setRoleData>({
    userId: "",
    roleIdList: [],
});

// 搜索关键词
const searchKey = ref<string>("");

// 选择的用户信息
const checkedUserIdList = ref<number[]>([]);

// 批量删除dialog显示
const batchRemoveDialogShow = ref<boolean>(false);

//
const checkedUserInfo = ref<{ id: number; username: string }[]>([]);

// 获取用户信息
const getUserInfo = async (page: number = 1, username?: string) => {
    const userInfoResponse = await reqUserInfo(page, limit.value, username);
    if (userInfoResponse.code === 200) {
        userInfo.value = userInfoResponse.data.records;
        total.value = userInfoResponse.data.total;
    }
};

// 搜索函数
const handlerSearch = () => {
    if (searchKey.value.trim() === "") {
        return;
    } else {
        getUserInfo(pageNo.value, searchKey.value);
    }
};

// 重置搜索
const handlerReset = () => {
    searchKey.value = "";
    getUserInfo(pageNo.value);
};

// 添加新用户
const addUser = async () => {
    try {
        const addUserResponse = await reqAddOrEditUser(addOrEditUserInfo.value);
        if (addUserResponse.code === 200) {
            ElMessage({
                type: "success",
                message: addOrEditUserInfo.value.id ? "修改用户成功" : "新增用户成功",
            });
            // 重新拉取数据
            // 如果是修改那么就在当前页
            if (addOrEditUserInfo.value.id) {
                getUserInfo(pageNo.value);
            } else {
                // 新增要跳到最后一页
                pageNo.value = Math.ceil((total.value + 1) / limit.value);
                getUserInfo(pageNo.value);
            }
        } else {
            ElMessage({
                type: "error",
                message: addOrEditUserInfo.value.id ? "修改用户失败" : "新增用户失败",
            });
        }
    } catch {
        ElMessage({
            type: "error",
            message: "网络错误请稍后重试",
        });
    } finally {
        addOrEditUserdrawerShow.value = false;
    }
};

const isAddUser = () => {
    return drawerTitle.value === "添加新用户";
};

// 规则
const rule = reactive<FormRules<AddUserDataForm>>({
    username: [
        { required: true, message: "用户名必须填写", trigger: "blur" },
        { min: 4, message: "用户名至少4个字符", trigger: "blur" },
    ],
    name: [{ required: true, message: "昵称必须填写", trigger: "blur" }],
    password: [
        { required: true, message: "密码必须填写", trigger: "blur" },
        { min: 6, max: 18, message: "密码长度必须是6-18位", trigger: "blur" },
    ],
});

// 分页器页面发生变化
const handlerChangePage = () => {
    getUserInfo(pageNo.value);
};

// 添加新用户
const handlerAddUser = () => {
    addOrEditUserdrawerShow.value = true;
    drawerTitle.value = "添加新用户";
};
// 修改用户
const handlerEditUser = (row: AddUserDataForm) => {
    // 收集数据
    addOrEditUserInfo.value = { ...row };
    addOrEditUserdrawerShow.value = true;
    drawerTitle.value = "修改用户信息";
};
// 获取当前用户拥有的角色列表
const getAllRoles = async (userId: number | string) => {
    const allRoleResponse: AllRolesResponse = await reqAllRole(userId);
    if (allRoleResponse.code === 200) {
        checkedRoleList.value = allRoleResponse.data.assignRoles;
        setRoleData.value.roleIdList = checkedRoleList.value.map((role) => role.id as number);
        rolesList.value = allRoleResponse.data.allRolesList;
        // 设置全选和半选状态
        checkAll.value = checkedRoleList.value.length === rolesList.value.length;
        isIndeterminate.value =
            checkedRoleList.value.length > 0 && checkedRoleList.value.length < rolesList.value.length;
    }
};

// 分配角色
const HandlerAllocateRole = async (row: AddUserDataForm) => {
    // 记录用户id
    setRoleData.value.userId = row.id as number;
    // 打开抽屉
    allocateRoleDrawerShow.value = true;

    // 收集数据
    allocateRoleData.value = {
        id: row.id as number,
        username: row.username,
    };

    // 获取当前用户拥有的角色列表
    await getAllRoles(row.id as number);
    checkAll.value = checkedRoleList.value.length === rolesList.value.length;
    isIndeterminate.value = checkedRoleList.value.length > 0 && checkedRoleList.value.length < rolesList.value.length;
};

const handlerCheckedRoleChange = (checkedValues: CheckboxValueType[]) => {
    // 更新全选和半选状态
    checkAll.value = checkedValues.length === rolesList.value.length;
    isIndeterminate.value = checkedValues.length > 0 && checkedValues.length < rolesList.value.length;
};
const handlerCheckAllChange = (value: boolean) => {
    if (value) {
        checkedRoleList.value = [...rolesList.value];
    } else {
        checkedRoleList.value = [];
    }
    isIndeterminate.value = false;
};

// 比较两个数据是否一样
function isEqual(arr1: number[], arr2: number[]) {
    const sortedArr1 = [...arr1].sort((a, b) => a - b);
    const sortedArr2 = [...arr2].sort((a, b) => a - b);
    return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
}

// 确定分配角色
const HandlerConfirmAllocateRole = async () => {
    // 先检擦数据是否有修改，没有就不发送请求
    // 其实就是比较setRoleData的roleIdList和checkedRoleList的id列表是否相等
    const checkedRoleIdList = checkedRoleList.value.map((role) => role.id as number);
    if (isEqual(setRoleData.value.roleIdList, checkedRoleIdList)) {
        ElMessage({
            type: "info",
            message: "角色没有修改，无需分配",
        });
        allocateRoleDrawerShow.value = false;
        return;
    }
    setRoleData.value.roleIdList = checkedRoleIdList;
    // 发送请求分配角色
    try {
        const setRoleResponse = await reqSetRole(setRoleData.value);
        if (setRoleResponse.code === 200) {
            ElMessage({
                type: "success",
                message: "分配角色成功",
            });
            // 重新拉取数据
            getUserInfo(pageNo.value);
        } else {
            ElMessage({
                type: "error",
                message: "分配角色失败，稍后重试",
            });
        }
    } catch {
        ElMessage({
            type: "error",
            message: "网络错误请稍后重试",
        });
    } finally {
        allocateRoleDrawerShow.value = false;
    }
};

// 取消分配角色
const HandlerCancelAllocateRole = () => {
    allocateRoleDrawerShow.value = false;
    // 清空角色数据
    allocateRoleData.value = {
        id: "",
        username: "",
    };
    // 清空已选择的角色列表
    checkedRoleList.value = [];
    // 重置全选和半选状态
    checkAll.value = false;
    isIndeterminate.value = false;
};

// 取消修改用户
const handlerCancelEditUser = () => {
    addOrEditUserdrawerShow.value = false;
    addOrEditUserInfo.value = {
        id: "",
        username: "",
        name: "",
        password: "",
    };
};

// 表单验证
const validateForm = async (Form: FormInstance | undefined) => {
    if (!Form) return;
    await Form.validate((valid, fields) => {
        if (valid) {
            // 发送请求添加新用户
            addUser();
        }
    });
};

// 抽屉关闭时候触发
const clearUserInfo = () => {
    addOrEditUserInfo.value = {
        id: "",
        username: "",
        name: "",
        password: "",
    };
    FormRef.value?.resetFields();
};

// 删除用户
const removeUser = async (row: AddUserDataForm, confirm: () => void) => {
    try {
        const removeResponse = await reqDeleteUser([row.id as number]);
        if (removeResponse.code === 200) {
            ElMessage({
                type: "success",
                message: `删除  ${row.name.toString()}  成功`,
            });
        } else {
            ElMessage({
                type: "error",
                message: `删除  ${row.name.toString()}  失败，稍后重试`,
            });
        }
    } catch {
        ElMessage({
            type: "error",
            message: "网络错误稍后重试",
        });
    } finally {
        confirm();
        getUserInfo(pageNo.value);
    }
};

// 选择用户
const handlerSelect = (selection: User[]) => {
    checkedUserInfo.value = selection.map((user) => {
        return { id: user.id as number, username: user.username as string };
    });
};

// 批量删除用户dialog显示
const removeMultipleUsers = () => {
    // 如果没有选择用户就提示
    if (checkedUserInfo.value.length === 0) {
        ElMessage({
            type: "info",
            message: "请先选择要删除的用户",
        });
        return;
    }
    // 显示批量删除dialog
    batchRemoveDialogShow.value = true;
};

// 用户取消批量删除
const cancelBatchRemoveUser = () => {
    ElMessage({
        type: "info",
        message: "已取消批量删除",
    });
    // 清除选择的用户列表
    checkedUserIdList.value = [];
    // 关闭批量删除dialog
    batchRemoveDialogShow.value = false;
};

// 用户确认批量删除
const handlerBatchRemoveUser = async () => {
    try {
        checkedUserIdList.value = checkedUserInfo.value.map((user) => user.id);
        const removeResponse = await reqDeleteUser(checkedUserIdList.value);
        if (removeResponse.code === 200) {
            ElMessage({
                type: "success",
                message: `删除选中用户成功`,
            });
            // 重新拉取数据
            getUserInfo(pageNo.value);
        } else {
            ElMessage({
                type: "error",
                message: `删除选中用户失败，稍后重试`,
            });
        }
    } catch {
        ElMessage({
            type: "error",
            message: "网络错误稍后重试",
        });
    } finally {
        // 清除选择的用户列表
        checkedUserIdList.value = [];
        getUserInfo(pageNo.value);
        // 关闭批量删除dialog
        batchRemoveDialogShow.value = false;
    }
};

// 组件挂载就请求数据
onMounted(() => {
    getUserInfo();
});

// 组件卸载时清除数据
onUnmounted(() => {
    userInfo.value = [];
});
</script>

<style scoped></style>
