# 存量融资模块 (FinExisting Module)

## 模块概述

存量融资模块是一个复杂的业务模块，用于管理已放款的融资项目。该模块涉及9张数据库表，包含了完整的融资生命周期管理功能。

## 数据库表结构

### 核心表
1. **fin_existing** - 存量融资主表，记录融资的基本信息
2. **fin_existing_disbursement** - 放款记录表，记录每次放款的详细信息
3. **fin_existing_repayment_plan** - 还本付息计划表，记录还款计划
4. **fin_existing_repayment_plan_item** - 还本付息计划明细表，记录每期还款详情
5. **fin_existing_repayment_record** - 还款记录表，记录实际还款情况

### 关系表
6. **fin_existing_disbursement_repayment_plan_rel** - 放款与还款计划关系表

### 扩展功能表
7. **fin_existing_guarantee** - 担保记录表，记录担保信息
8. **fin_existing_guarantee_asset** - 担保物关系表，记录担保物信息
9. **fin_existing_linkage** - 勾稽表，记录与储备融资的关联关系

## 模块架构

### 主模块
- **FinExistingModule** - 主模块，负责整合所有子功能
- **FinExistingController** - 主控制器，提供基础的CRUD操作
- **FinExistingService** - 主服务，处理存量融资的核心业务逻辑

### 子模块
本模块采用分层架构，按业务功能划分为以下子模块：

#### 1. 放款管理 (Disbursement)
- **DisbursementController** - 处理放款相关的API请求
- **DisbursementService** - 管理放款记录的业务逻辑
- 主要功能：放款记录的创建、查询、更新

#### 2. 还款管理 (Repayment)
- **RepaymentController** - 处理还款相关的API请求
- **RepaymentService** - 管理还款计划和记录的业务逻辑
- 主要功能：还款计划生成、还款记录管理、计划明细维护

#### 3. 担保管理 (Guarantee)
- **GuaranteeController** - 处理担保相关的API请求
- **GuaranteeService** - 管理担保信息的业务逻辑
- 主要功能：担保记录管理、担保物关系维护

#### 4. 勾稽管理 (Linkage)
- **LinkageController** - 处理勾稽相关的API请求
- **LinkageService** - 管理勾稽关系的业务逻辑
- 主要功能：存量融资与储备融资的关联管理

## API 路由设计

**当前状态**：已定义控制器路由基础，但暂无具体API接口实现。

**计划的路由结构**：
```
/api/v1/fin/existing                    # 存量融资主功能 (待实现)
/api/v1/fin/existing/disbursement       # 放款管理 (待实现)
/api/v1/fin/existing/repayment          # 还款管理 (待实现)
/api/v1/fin/existing/guarantee          # 担保管理 (待实现)
/api/v1/fin/existing/linkage            # 勾稽管理 (待实现)
```

## 实体设计

所有实体类都位于 `src/entities/` 目录下，命名规则为 `finExisting*.entity.ts`：

- `FinExisting` - 存量融资主实体
- `FinExistingDisbursement` - 放款记录实体
- `FinExistingRepaymentPlan` - 还款计划实体
- `FinExistingRepaymentPlanItem` - 还款计划明细实体
- `FinExistingRepaymentRecord` - 还款记录实体
- `FinExistingDisbursementRepaymentPlanRel` - 放款与还款计划关系实体
- `FinExistingGuarantee` - 担保记录实体
- `FinExistingGuaranteeAsset` - 担保物关系实体
- `FinExistingLinkage` - 勾稽实体

## DTO 设计

**当前状态**：暂无DTO定义，需要在后续开发阶段根据具体业务需求创建相应的DTO类。

## 开发状态

⚠️ **注意：当前模块仅提供基础架构和实体定义，暂无任何业务功能实现**

### 当前状态
- ✅ 已完成：9个数据库实体定义
- ✅ 已完成：模块基础架构
- ✅ 已完成：依赖注入配置
- ✅ 已完成：控制器和服务基础结构
- ❌ 待实现：所有业务逻辑
- ❌ 待实现：API接口
- ❌ 待实现：DTO定义

## 后续开发计划

1. **第一阶段**：实现存量融资主功能的CRUD操作
2. **第二阶段**：实现放款管理功能
3. **第三阶段**：实现还款管理功能
4. **第四阶段**：实现担保管理功能
5. **第五阶段**：实现勾稽管理功能
6. **第六阶段**：完善业务逻辑和数据校验
7. **第七阶段**：添加单元测试和集成测试

## 使用说明

要使用此模块，需要在主应用模块中导入：

```typescript
import { FinExistingModule } from './modules/finExisting/finExisting.module';

@Module({
  imports: [
    // ... 其他模块
    FinExistingModule,
  ],
})
export class AppModule {}
```

## 注意事项

1. 该模块使用了雪花算法生成ID
2. 所有BigInt字段都使用了numberTransformer进行转换
3. Boolean字段使用了booleanTransformer处理数据库0/1值
4. 模块采用依赖注入方式管理服务依赖关系
5. 所有API都包含了完整的Swagger文档注解 