<template>
    <div class="permission-container" style="height: 100%; padding: 20px; position: relative">
        <el-table :data="menuList" style="width: 100%; height: 100%; margin-bottom: 20px" row-key="id" virtual>
            <el-table-column label="名称" prop="name" header-align="center"></el-table-column>
            <el-table-column label="权限值" prop="code" align="center"></el-table-column>
            <el-table-column label="修改时间" prop="updateTime" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="{ row, index }">
                    <el-button
                        type="primary"
                        size="small"
                        :disabled="row.level === 4 ? true : false"
                        @click="openDialog(row)"
                        >{{ row.level >= 3 ? "添加功能" : "添加菜单" }}</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        :disabled="row.level === 1 ? true : false"
                        @click="openDialog(row, true)"
                        >编辑</el-button
                    >
                    <el-popconfirm
                        title="确定删除这个菜单吗？"
                        @visible-change="onPopconfirmVisibleChange"
                        :disabled="row.level === 1 ? true : false"
                    >
                        <template #reference>
                            <el-button type="danger" size="small" @click="handlerDeleteRole">删除</el-button>
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

        <!-- 添加或编辑菜单对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" center>
            <template #header>
                <span>{{ dialogTitle }}</span>
            </template>
            <template #default>
                <el-form :model="currentMenu" label-width="80px" label-position="left" ref="menuFormRef" :rules="rules">
                    <el-form-item label="名称">
                        <el-input v-model="currentMenu.name"></el-input>
                    </el-form-item>
                    <el-form-item label="权限值">
                        <el-input v-model="currentMenu.code"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button type="default" size="small" @click="cancelAddOrEdit">取 消</el-button>
                <el-button type="primary" size="small" @click="validateFormData">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { reqMenuList, reqAddOrUpdateMenu, reqDeleteMenu } from "@/api/acl/menu/index.ts";
import type { MenuListResponseData, MenuItem } from "@/api/acl/menu/type.ts";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";

// 菜单列表
const menuList = ref<MenuItem[]>([]);

// 对话框相关
const dialogTitle = ref<string>("");
const dialogVisible = ref<boolean>(false);
const currentMenu = ref<MenuItem>({
    name: "",
    code: "",
    level: 0,
    pid: 0,
});

// 表单引用
const menuFormRef = ref<FormInstance>();

// 表单验证规则
const rules = ref<FormRules>({
    name: [
        { required: true, message: "请输入菜单名称", trigger: "blur" },
        { min: 2, max: 12, message: "名称长度必须在 2 到 12 个字符之间", trigger: "blur" },
    ],
    code: [{ required: true, message: "请输入权限值", trigger: "blur" }],
});

// 删除菜单相关
const canDelete = ref<boolean>(false);
const delayTime = ref<number>(5);

// 获取菜单列表
const getMenuList = async () => {
    try {
        const res: MenuListResponseData = await reqMenuList();
        if (res.code === 200) {
            menuList.value = res.data;
        } else {
            ElMessage({
                type: "error",
                message: "获取菜单列表失败",
            });
        }
    } catch (error) {
        ElMessage({
            type: "error",
            message: "获取菜单列表失败",
        });
    }
};

// 点击对话框打开函数
const openDialog = (row: MenuItem, isEdit: boolean = false) => {
    dialogTitle.value = isEdit ? "编辑菜单" : row.level >= 3 ? "添加功能" : "添加菜单";
    dialogVisible.value = true;
    if (isEdit) {
        currentMenu.value.id = row.id;
        currentMenu.value.name = row.name;
        currentMenu.value.code = row.code;
        currentMenu.value.level = row.level;
        currentMenu.value.pid = row.pid;
    } else {
        currentMenu.value = {
            name: "",
            code: "",
            level: row.level + 1,
            pid: row.id as number,
            type: 0,
        };
    }
};

// 验证表单数据
const validateFormData = async () => {
    if (!menuFormRef.value) return false;
    await menuFormRef.value.validate((valid) => {
        if (valid) {
            // 如果表单验证通过，调用confirmAddOrEdit
            confirmAddOrEdit();
        } else {
            ElMessage({
                type: "error",
                message: "请完善表单信息",
            });
        }
    });
};

// 取消添加或编辑
const cancelAddOrEdit = () => {
    dialogVisible.value = false;
    currentMenu.value = {
        name: "",
        code: "",
        level: 0,
        pid: 0,
        type: 0,
    };
};
// 确认添加或编辑
const confirmAddOrEdit = async () => {
    try {
        const addResponse = await reqAddOrUpdateMenu(currentMenu.value);
        if (addResponse.code === 200) {
            ElMessage({
                type: "success",
                message: currentMenu.value.id ? "更新成功" : "添加成功",
            });
            dialogVisible.value = false;
            getMenuList();
        } else {
            ElMessage({
                type: "error",
                message: currentMenu.value.id ? "更新失败" : "添加失败",
            });
        }
    } catch (error) {
        ElMessage({
            type: "error",
            message: currentMenu.value.id ? "更新失败" : "添加失败",
        });
        dialogVisible.value = false;
        getMenuList();
    } finally {
        // 无论成功还是失败，都重置表单数据
        currentMenu.value = {
            name: "",
            code: "",
            level: 0,
            pid: 0,
            type: 0,
        };
    }
};

// 处理删除菜单的函数，点击删除按钮时调用
let timer: ReturnType<typeof setInterval> | null = null;

// 确定删除
const handlerSureDelete = async (row: MenuItem, confirm: Function) => {
    try {
        const deleteResponse = await reqDeleteMenu(row.id as number);
        if (deleteResponse.code === 200) {
            // 提示信息删除成功
            ElMessage({
                type: "success",
                message: "删除成功",
            });
            // 重新拉取数据
            getMenuList();
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

// 处理删除菜单的函数，点击删除按钮时调用
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

// popconfirm关闭时清理定时器
const onPopconfirmVisibleChange = (visible: boolean) => {
    if (!visible) {
        if (timer) clearInterval(timer);
        timer = null;
        canDelete.value = false;
        delayTime.value = 5;
    }
};

onMounted(async () => {
    await getMenuList();
});
</script>

<style scoped></style>
