-- 修复SPU描述字段长度问题
-- 将description列从varchar(255)增加到text类型，支持更长的描述内容

USE vue3_admin;

-- 修改spu表的description列
ALTER TABLE spu MODIFY COLUMN description TEXT NOT NULL;

-- 验证修改结果
DESCRIBE spu;
