# RAX Server

基于 NestJS + TypeORM + MySQL 的企业级后端服务框架

## 技术栈

- **框架**: NestJS 10.x
- **数据库**: MySQL 8.x
- **ORM**: TypeORM
- **语言**: TypeScript
- **包管理**: pnpm
- **API文档**: Swagger

## 核心功能模块

### 🔐 RBAC 权限管理系统

基于角色的访问控制（Role-Based Access Control）系统，包含以下模块：

#### UserModule - 用户管理
- ✅ 用户的 CRUD 操作
- ✅ 用户信息管理
- ✅ 用户状态管理（启用/禁用）
- ✅ 密码管理（修改密码、重置密码）
- ✅ 密码加密存储（bcrypt + salt）

**API 端点:**
- `POST /api/v1/user/create` - 创建用户
- `POST /api/v1/user/edit` - 更新用户
- `GET /api/v1/user/remove/:id` - 删除用户
- `GET /api/v1/user/get/:id` - 获取用户详情
- `POST /api/v1/user/list` - 分页查询用户
- `POST /api/v1/user/reset-password/:id` - 重置密码
- `POST /api/v1/user/change-password/:id` - 修改密码

#### RoleModule - 角色管理
- ✅ 角色的 CRUD 操作
- ✅ 角色信息管理
- ✅ 角色编码管理

#### PermissionModule - 权限管理 ⭐
- ✅ 用户角色分配/取消
- ✅ 角色资源权限分配/取消
- ✅ 用户权限查询（通过角色获取资源）
- ✅ 权限验证逻辑

**核心方法:**
- `assignUserRoles()` - 分配用户角色
- `assignRoleResources()` - 分配角色资源权限
- `getUserPermissions()` - 获取用户权限
- `hasPermission()` - 检查用户权限
- `getUserMenus()` - 获取用户菜单权限

### 🏢 组织管理系统

#### SysOrgModule - 组织管理
- ✅ 层级组织结构管理
- ✅ 组织编码自动生成（4位一级：0001, 00010001, 000100010001）
- ✅ 组织树形结构查询

### 📚 数据字典系统

#### SysDictModule - 字典管理
- ✅ 数据字典管理
- ✅ 字典项层级管理
- ✅ 字典项树形结构

### 🏦 银行信息系统

#### SysBankModule - 银行管理
- ✅ 银行信息管理
- ✅ 联行号查询

## 数据库设计

### RBAC 核心表结构

```sql
-- 用户表
sys_user (id, org_id, mobile, name, gender, password, salt, status, ...)

-- 角色表  
sys_role (id, code, name, comment, ...)

-- 资源表
sys_resource (id, code, name, type, parent_id, path, component, ...)

-- 用户角色关系表
sys_user_role (id, user_id, role_id)

-- 角色资源关系表
sys_role_resource (id, role_id, resource_id)
```

## 安装和运行

### 环境要求
- Node.js >= 18.x
- MySQL >= 8.0
- pnpm >= 8.x

### 安装依赖
```bash
pnpm install
```

### 配置环境变量
复制 `.env.example` 到 `.env` 并配置数据库连接信息：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=rax_server
```

### 运行应用
```bash
# 开发模式
pnpm run start:dev

# 生产模式
pnpm run start:prod

# 构建
pnpm run build
```

## 核心特性

### ✨ 统一响应格式
所有 API 返回统一的响应格式：
```json
{
  "success": true,
  "message": "操作成功",
  "data": {...}
}
```

### 🛡️ 全局异常处理
- 业务异常：`RaxBizException`
- 统一错误响应格式
- 详细错误日志记录

### 🔢 数据类型安全
- 所有 ID 字段统一使用 `number` 类型
- BigInt 字段自动转换为数字类型
- Snowflake ID 生成器确保唯一性

### 📄 分页查询
- 统一的分页查询基类 `PageQueryDto`
- 标准分页响应格式 `PageResult<T>`

### ✅ 参数验证
- 使用 `class-validator` 进行参数验证
- 详细的验证错误信息
- 自动类型转换和验证

## 开发进度

### ✅ 已完成
- [x] 基础框架搭建
- [x] 数据库连接配置
- [x] 全局异常处理
- [x] 统一响应拦截器
- [x] Snowflake ID 生成器
- [x] 组织管理模块
- [x] 数据字典模块
- [x] 银行信息模块
- [x] 用户管理模块
- [x] 角色管理模块
- [x] 权限管理模块
- [x] RBAC 权限体系

### 🚧 开发中
- [ ] 资源管理模块
- [ ] 认证模块（JWT）
- [ ] 权限守卫
- [ ] API 文档完善

### 📋 待开发
- [ ] 文件上传模块
- [ ] 日志审计模块
- [ ] 系统监控
- [ ] 单元测试

## 许可证

MIT License
