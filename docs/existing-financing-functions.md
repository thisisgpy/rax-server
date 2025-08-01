# 存量融资(finExisting)模块需求说明

## 数据库表对应关系

1. `fin_existing`，基础信息
2. `fin_existing_disbursement`，放款记录
3. `fin_existing_repayment_plan`，还本付息计划
4. `fin_existing_disbursement_repayment_plan_rel`，放款记录和还本付息计划的关联关系
5. `fin_existing_repayment_plan_item`，还本付息计划明细
6. `fin_existing_repayment_record`，还本付息计划对应的还款记录
7. `fin_existing_guarantee`，融资担保和反担保信息
8. `fin_existing_guarantee_asset`，融资担保、反担保和固定资产的关联关系
9. `fin_existing_linkage`，存量融资和储备融资的勾稽关系

## 模块整体描述

一笔存量融资的完整数据由基本信息、放款记录、还本付息计划、还本付息计划明细、还款记录、担保、勾稽关系七个部分组成，他们之间的关系如下。

1. 一笔存量融资可以有多条放款记录，但所有放款记录的放款金额(`amount`)总和不能超过存量融资的融资总额(`funding_amount`)
2. 每条放款记录只能和一份没有作废的还本付息计划关联，并且这份还本付息计划必须和放款记录同属一笔存量融资
3. 一份没有作废的还本付息计划可以关联多条放款记录
4. 还本付息计划明细必须归属于一份还本付息计划，已作废的还本付息计划不能再执行任何写操作
5. 还款记录原则上必须和一条还本付息计划明细关联(使用 `repayment_plan_item_id` 字段)，但系统支持用户新增自由还款计划(`repayment_plan_item_id` = 0)
6. 担保记录只能从属于存量融资记录，即通过 `existing_id` 字段与存量融资关联
7. 每条担保记录可以有多条反担保记录
8. 担保记录和反担保记录采用相同的数据结构，担保记录的 `counter_guarantee_id` 字段值为0，反担保记录的 `counter_guarantee_id` 字段需要保存对应担保记录的 ID
9. 担保记录和反担保记录都可以关联多个担保物（固定资产），一个担保物（固定资产）也可以被多条担保记录和反担保记录关联
10. 一笔存量融资可以勾稽多条储备融资，但所有勾稽记录的勾稽金额(`linkage_amount`)总和不能超过存量融资的融资总额(`funding_amount`)

## 枚举定义

金融机构类型 `InstitutionTypeEnum`

  - 1 银行
  - 2 非银行金融机构

还款方式 `RepaymentMethodEnum`

  - 1 先息后本
  - 2 定期还本付息
  - 3 到期一次性还本付息
  - 4 定期付息不定期还本
  - 5 定期还本不定期付息
  - 6 其他

还款周期 `RepaymentPeriodEnum`

  - 1 每月还款
  - 2 每季度还款
  - 3 每半年还款
  - 4 每年还款
  - 5 不定期还款
  - 6 其他

利率类型 `InterestTypeEnum`

  - 1 固定利率
  - 2 浮动利率

计息基准 `DaysCountBasisEnum`

  - 1 ACT/365
  - 2 ACT/360
  - 3 30/360

## 接口清单

所有接口的 Path 都以 ` /api/v1/fin/existing` 作为前缀，即 `@Controller('/api/v1/fin/existing')`

1. 创建存量融资 `@Post('create')`
   1. 需要同时接收放款记录、担保（反担保）记录、勾稽关系的相关参数
   2. 不需要接收还本付息计划相关的参数
2. 编辑存量融资 `@Post('edit')`
   1. 只允许编辑存量融资基本信息，即 `fin_existing` 表中的字段（放款总额字段不允许编辑）
3. 删除存量融资 `@Get('remove/:id')`
   1. 逻辑删除，注意不需要对关联数据进行逻辑删除
4. 查询存量融资详情 `@Get('get/:id')`
   1. 返回存量融资全部信息，包括基本信息、放款记录、未作废的还本付息计划、还本付息计划明细、还款记录、担保、勾稽关系
5. 多条件分页查询融资列表 `@Post('list')`
   1. 查询条件有：分页字段、融资主体ID（等值匹配）、融资方式（等值匹配）、金融机构类型（等值匹配）、金融机构名称（模糊匹配）、融资总额（单位万元，范围匹配）、回报利率（范围匹配）、还款周期（等值匹配）、还款方式（等值匹配）、利率类型（等值匹配）、是否多次放款（等值匹配）、融资期限（范围匹配）、融资到期日（范围匹配）、是否公开融资（等值匹配）
   2. 查询字段：存量融资 ID、存量融资编码、融资主体 ID（组织 ID）、融资主体名称（组织名称）、融资方式、金融机构名称、融资总额、放款总额、融资期限