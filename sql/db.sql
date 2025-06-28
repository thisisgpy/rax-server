-- 用户
DROP TABLE IF EXISTS `sys_user`;

CREATE TABLE
  `sys_user` (
    `id` BIGINT(20) NOT NULL COMMENT '用户ID',
    `org_id` BIGINT(20) NOT NULL COMMENT '组织ID',
    `mobile` VARCHAR(11) NOT NULL COMMENT '手机号',
    `name` VARCHAR(64) NOT NULL COMMENT '用户名称',
    `gender` VARCHAR(8) DEFAULT '男' COMMENT '性别. 男, 女',
    `id_card` VARCHAR(18) COMMENT '身份证号',
    `password` VARCHAR(256) NOT NULL COMMENT '密码',
    `is_init_password` TINYINT(1) DEFAULT 0 COMMENT '是否初始化密码. 0:否, 1:是',
    `status` TINYINT(2) DEFAULT 1 COMMENT '状态. 0:禁用, 1:启用',
    `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除. 0:否, 1:是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_user_id` (`id`)
  );

-- 角色
DROP TABLE IF EXISTS `sys_role`;

CREATE TABLE
  `sys_role` (
    `id` BIGINT(20) NOT NULL COMMENT '角色ID',
    `code` VARCHAR(64) NOT NULL COMMENT '角色编码',
    `name` VARCHAR(64) NOT NULL COMMENT '角色名称',
    `comment` VARCHAR(128) COMMENT '角色备注',
    `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除. 0:否, 1:是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_role_id` (`id`)
  );

-- 用户角色关系
DROP TABLE IF EXISTS `sys_user_role`;

CREATE TABLE
  `sys_user_role` (
    `id` BIGINT(20) NOT NULL COMMENT '用户角色关系ID',
    `user_id` BIGINT(20) NOT NULL COMMENT '用户ID',
    `role_id` BIGINT(20) NOT NULL COMMENT '角色ID',
    PRIMARY KEY `pk_user_role_id` (`id`)
  );

-- 资源
DROP TABLE IF EXISTS `sys_resource`;

CREATE TABLE
  `sys_resource` (
    `id` BIGINT(20) NOT NULL COMMENT '资源ID',
    `code` VARCHAR(64) NOT NULL COMMENT '资源编码',
    `name` VARCHAR(64) NOT NULL COMMENT '资源名称',
    `type` TINYINT(2) DEFAULT 0 COMMENT '资源类型. 0:目录, 1:菜单, 2:按钮',
    `parent_id` BIGINT(20) DEFAULT 0 COMMENT '父级资源ID. 0表示没有父级资源',
    `path` VARCHAR(128) COMMENT '资源路径',
    `component` VARCHAR(128) COMMENT '资源组件',
    `icon` VARCHAR(64) COMMENT '资源图标',
    `sort` INT(11) DEFAULT 0 COMMENT '资源排序',
    `is_hidden` TINYINT(1) DEFAULT 0 COMMENT '是否隐藏. 0:否, 1:是',
    `is_keep_alive` TINYINT(1) DEFAULT 0 COMMENT '是否缓存. 0:否, 1:是',
    `is_external_link` TINYINT(1) DEFAULT 0 COMMENT '是否外部链接. 0:否, 1:是',
    `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除. 0:否, 1:是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_resource_id` (`id`)
  );

-- 角色资源关系
DROP TABLE IF EXISTS `sys_role_resource`;

CREATE TABLE
  `sys_role_resource` (
    `id` BIGINT(20) NOT NULL COMMENT '角色资源关系ID',
    `role_id` BIGINT(20) NOT NULL COMMENT '角色ID',
    `resource_id` BIGINT(20) NOT NULL COMMENT '资源ID',
    PRIMARY KEY `pk_role_resource_id` (`id`)
  );

-- 组织
DROP TABLE IF EXISTS `sys_org`;

CREATE TABLE
  `sys_org` (
    `id` BIGINT(20) NOT NULL COMMENT '组织ID',
    `code` VARCHAR(64) NOT NULL COMMENT '组织编码. 4位一级. 0001,00010001,000100010001,以此类推',
    `name` VARCHAR(64) NOT NULL COMMENT '组织名称',
    `name_abbr` VARCHAR(64) NOT NULL COMMENT '组织名称简称',
    `comment` VARCHAR(128) COMMENT '组织备注',
    `parent_id` BIGINT(20) DEFAULT 0 COMMENT '父级组织ID. 0表示没有父组织',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_org_id` (`id`)
  );

-- 字典
DROP TABLE IF EXISTS `sys_dict`;

CREATE TABLE
  `sys_dict` (
    `id` BIGINT(20) NOT NULL COMMENT '字典ID',
    `code` VARCHAR(64) UNIQUE NOT NULL COMMENT '字典编码',
    `name` VARCHAR(64) UNIQUE NOT NULL COMMENT '字典名称',
    `comment` VARCHAR(128) COMMENT '字典备注',
    `is_enabled` TINYINT (1) DEFAULT 1 COMMENT '是否启用. 0: 禁用, 1: 启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_dict_id` (`id`)
  );

-- 字典项
DROP TABLE IF EXISTS `sys_dict_item`;

CREATE TABLE
  `sys_dict_item` (
    `id` BIGINT(20) NOT NULL COMMENT '字典项ID',
    `dict_id` BIGINT(20) NOT NULL COMMENT '字典ID',
    `dict_code` VARCHAR(64) NOT NULL COMMENT '字典编码',
    `label` VARCHAR(64) NOT NULL COMMENT '字典项标签',
    `value` VARCHAR(64) NOT NULL COMMENT '字典项值',
    `comment` VARCHAR(128) COMMENT '字典项备注',
    `sort` INT (11) DEFAULT 0 COMMENT '字典项排序',
    `parent_id` BIGINT(20) DEFAULT 0 COMMENT '父级字典项ID. 0表示没有父级字典项',
    `is_enabled` TINYINT (1) DEFAULT 1 COMMENT '是否启用,不对子级生效. 0: 禁用, 1: 启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_dict_item_id` (`id`)
  );

-- 银行
DROP TABLE IF EXISTS `sys_bank`;

CREATE TABLE
  `sys_bank` (
    `code` VARCHAR(64) COMMENT '联行号',
    `name` VARCHAR(64) COMMENT '银行名称',
    `name_abbr` VARCHAR(64) COMMENT '银行名称简称',
    `province` VARCHAR(64) COMMENT '省份',
    `city` VARCHAR(64) COMMENT '城市',
    `branch_name` VARCHAR(64) COMMENT '支行名称',
    PRIMARY KEY `pk_bank_code` (`code`)
  );

-- 附件
DROP TABLE IF EXISTS `sys_attachment`;

CREATE TABLE
  `sys_attachment` (
    `id` BIGINT(20) NOT NULL COMMENT '附件 ID',
    `biz_module` VARCHAR(64) COMMENT '业务模块名称',
    `biz_id` BIGINT(20) COMMENT '业务数据 ID',
    `original_name` VARCHAR(128) COMMENT '原文件名',
    `saved_name` VARCHAR(128) COMMENT '存储文件名',
    `extension` VARCHAR(32) COMMENT '文件扩展名',
    `file_size` BIGINT(20) COMMENT '文件大小. 以byte为单位',
    `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除. 0:否, 1:是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    PRIMARY KEY `pk_attachment_id` (`id`)
  );

-- 非银行金融机构
DROP TABLE IF EXISTS `fin_non_bank_institution`;

CREATE TABLE
  `fin_non_bank_institution` (
    `id` BIGINT(20) NOT NULL COMMENT '非银行金融机构 ID',
    `province` VARCHAR(16) COMMENT '省份',
    `city` VARCHAR(16) COMMENT '城市',
    `name` VARCHAR(64) COMMENT '非银行金融机构全称',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    PRIMARY KEY `pk_non_bank_institution_id` (`id`)
  );

-- 储备融资
DROP TABLE IF EXISTS `fin_reserve`;

CREATE TABLE
  `fin_reserve` (
    `id` BIGINT(20) NOT NULL COMMENT '储备融资 ID',
    `code` VARCHAR(64) COMMENT '储备融资编码.编码规则: RF 开头，后面跟 yyMMddHHmmss',
    `org_id` BIGINT(20) COMMENT '融资主体 ID',
    `institution_type` TINYINT(2) COMMENT '金融机构类型. 1: 银行, 2: 非银行金融机构',
    `financial_institution_id` BIGINT(20) COMMENT '金融机构 ID',
    `financial_institution_name` VARCHAR(64) COMMENT '金融机构名称',
    `funding_mode` VARCHAR(64) COMMENT '融资方式',
    `funding_amount` BIGINT (20) COMMENT '融资金额，以分计算',
    `expected_disbursement_date` DATE COMMENT '预计放款日期',
    `loan_renewal_from_id` BIGINT(20) DEFAULT 0 COMMENT '续贷来源 ID.0 表示非续贷',
    `leader_name` VARCHAR(64) COMMENT '牵头领导名称',
    `leader_id` BIGINT(20) COMMENT '牵头领导 ID',
    `handler_name` VARCHAR(64) COMMENT '经办人名称',
    `handler_id` BIGINT(20) COMMENT '经办人 ID',
    `combined_ratio` DECIMAL(8, 4) COMMENT '综合成本率',
    `additional_costs` BIGINT (20) COMMENT '额外成本，以分计算',
    `status` TINYINT (2) COMMENT '状态. 0:待放款, 1:已放款, 2:已取消',
    `is_deleted` TINYINT (1) DEFAULT 0 COMMENT '是否删除. 0:否, 1:是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_reserve_id` (`id`)
  );

-- 储备融资成本
DROP TABLE IF EXISTS `fin_reserve_cost`;

CREATE TABLE
  `fin_reserve_cost` (
    `id` BIGINT(20) NOT NULL COMMENT '储备融资成本 ID',
    `reserve_id` BIGINT(20) COMMENT '储备融资 ID',
    `cost_type` VARCHAR(64) COMMENT '成本类型',
    `cost_description` VARCHAR(64) COMMENT '成本描述.可能是数字、百分比、文字',
    `is_deleted` TINYINT (1) DEFAULT 0 COMMENT '是否删除. 0:否, 1:是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_reserve_cost_id` (`id`)
  );

-- 储备融资进度
DROP TABLE IF EXISTS `fin_reserve_progress`;

CREATE TABLE
  `fin_reserve_progress` (
    `id` BIGINT(20) NOT NULL COMMENT '储备融资进度 ID',
    `reserve_id` BIGINT(20) COMMENT '储备融资 ID',
    `progress_name` VARCHAR(64) COMMENT '进度名称',
    `plan_date` DATE COMMENT '计划日期',
    `actual_date` DATE COMMENT '实际日期',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_reserve_progress_id` (`id`)
  );

-- 储备融资进度报告
DROP TABLE IF EXISTS `fin_reserve_report`;

CREATE TABLE
  `fin_reserve_report` (
    `id` BIGINT(20) NOT NULL COMMENT '储备融资进度报告 ID',
    `reserve_id` BIGINT(20) COMMENT '储备融资 ID',
    `report_content` VARCHAR(512) COMMENT '报告内容',
    `is_deleted` TINYINT (1) DEFAULT 0 COMMENT '是否删除. 0:否, 1:是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_reserve_report_id` (`id`)
  );

-- 存量融资
DROP TABLE IF EXISTS `fin_existing`;

CREATE TABLE
  `fin_existing` (
    `id` BIGINT(20) COMMENT '存量融资 ID',
    `code` VARCHAR(64) COMMENT '存量融资编码. 编码规则: EF 开头，后面跟 yyMMddHHmmss',
    `reserve_id` BIGINT(20) COMMENT '储备融资 ID. 0 表示非储备融资转入',
    `org_id` BIGINT(20) COMMENT '融资主体 ID',
    `org_code` VARCHAR(64) COMMENT '融资主体编码',
    `fin_name` VARCHAR(64) COMMENT '融资名称',
    `funding_structure` VARCHAR(64) COMMENT '融资结构',
    `funding_mode` VARCHAR(64) COMMENT '融资方式',
    `institution_type` TINYINT(2) COMMENT '金融机构类型. 1: 银行, 2: 非银行金融机构',
    `financial_institution_id` BIGINT(20) COMMENT '金融机构 ID',
    `financial_institution_name` VARCHAR(64) COMMENT '金融机构名称',
    `funding_amount` BIGINT (20) COMMENT '融资总额，以分计算',
    `return_interest_rate` DECIMAL(8, 4) COMMENT '回报利率',
    `repayment_period` TINYINT (2) COMMENT '还款周期',
    `repayment_method` TINYINT (2) COMMENT '还款方式',
    `interest_type` TINYINT (2) COMMENT '利息类型',
    `loan_prime_rate` DECIMAL(8, 4) COMMENT '基准利率',
    `basis_point` DECIMAL(8, 4) COMMENT '基点',
    `days_count_basis` TINYINT (2) COMMENT '计息基准',
    `include_settlement_date` TINYINT (1) DEFAULT 1 COMMENT '结息日当日是否计息. 0: 否, 1: 是',
    `repayment_delay_days` INT (11) DEFAULT 0 COMMENT '还款日相对于结息日的延迟天数',
    `loan_renewal_from_id` BIGINT(20) DEFAULT 0 COMMENT '续贷来源 ID.0 表示非续贷',
    `is_multiple` TINYINT (1) DEFAULT 0 COMMENT '是否为多次放款. 0: 否, 1: 是',
    `fin_term` INT (11) COMMENT '融资期限，以月为单位',
    `maturity_date` DATE COMMENT '融资到期日.即合同截止日，不是最后还款日',
    `is_public` TINYINT (1) DEFAULT 1 COMMENT '是否为公开融资. 0: 否, 1: 是',
    `is_deleted` TINYINT (1) DEFAULT 0 COMMENT '是否删除. 0: 否, 1: 是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_id` (`id`)
  );

-- 存量融资放款记录
DROP TABLE IF EXISTS `fin_existing_disbursement`;

CREATE TABLE
  `fin_existing_disbursement` (
    `id` BIGINT(20) NOT NULL COMMENT '融资放款 ID',
    `existing_id` BIGINT(20) COMMENT '存量融资 ID',
    `amount` BIGINT (20) COMMENT '放款金额，以分计算',
    `accounting_date` DATE COMMENT '到账日期',
    `disbursement_method` VARCHAR(64) COMMENT '放款方式',
    `interest_start_date` DATE COMMENT '起息日',
    `first_repayment_date` DATE COMMENT '首次还款日',
    `last_repayment_date` DATE COMMENT '最后还款日',
    `is_deleted` TINYINT (1) DEFAULT 0 COMMENT '是否删除. 0: 否, 1: 是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_disbursement_id` (`id`)
  );

-- 存量融资还本付息计划
DROP TABLE IF EXISTS `fin_existing_repayment_plan`;

CREATE TABLE
  `fin_existing_repayment_plan` (
    `id` BIGINT(20) NOT NULL COMMENT '还本付息计划 ID',
    `existing_id` BIGINT(20) COMMENT '存量融资 ID',
    `is_valid` TINYINT(1) DEFAULT 0 COMMENT '是否作废.0:否, 1:是',
    `invalid_comment` VARCHAR(512) COMMENT '作废原因',
    `is_deleted` TINYINT (1) DEFAULT 0 COMMENT '是否删除. 0: 否, 1: 是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_repayment_plan_id` (`id`)
  );

-- 存量融资放款与还本付息计划关系
DROP TABLE IF EXISTS `fin_existing_disbursement_repayment_plan_rel`;

CREATE TABLE
  `fin_existing_disbursement_repayment_plan_rel` (
    `id` BIGINT(20) NOT NULL COMMENT '融资放款与还本付息计划关系 ID',
    `existing_id` BIGINT(20) COMMENT '存量融资 ID',
    `disbursement_id` BIGINT(20) COMMENT '融资放款 ID',
    `repayment_plan_id` BIGINT(20) COMMENT '还本付息计划 ID',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_disbursement_repayment_plan_rel_id` (`id`)
  );

-- 存量融资还本付息计划明细
DROP TABLE IF EXISTS `fin_existing_repayment_plan_item`;

CREATE TABLE
  `fin_existing_repayment_plan_item` (
    `id` BIGINT(20) NOT NULL COMMENT '还本付息明细 ID',
    `existing_id` BIGINT(20) COMMENT '存量融资 ID',
    `disbursement_id` BIGINT(20) COMMENT '融资放款 ID',
    `repayment_plan_id` BIGINT(20) COMMENT '还本付息计划 ID',
    `period` INT (11) COMMENT '期数',
    `interest_settle_date` DATE COMMENT '结息日',
    `interest_calculate_date` INT (11) COMMENT '计息天数',
    `estimated_repayment_date` DATE COMMENT '预测还款日期',
    `estimated_repayment_principal` BIGINT (20) COMMENT '预测还款本金，以分计算',
    `estimated_repayment_interest` BIGINT (20) COMMENT '预测还款利息，以分计算',
    `estimated_repayment_amount` BIGINT (20) COMMENT '预测还款总额，以分计算',
    `is_deleted` TINYINT (1) DEFAULT 0 COMMENT '是否删除. 0: 否, 1: 是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_repayment_plan_item_id` (`id`)
  );

-- 存量融资还本付息计划下的还款记录
DROP TABLE IF EXISTS `fin_existing_repayment_record`;

CREATE TABLE
  `fin_existing_repayment_record` (
    `id` BIGINT(20) NOT NULL COMMENT '还款记录 ID',
    `existing_id` BIGINT(20) COMMENT '存量融资 ID',
    `repayment_plan_id` BIGINT(20) COMMENT '还本付息计划 ID',
    `repayment_plan_item_id` BIGINT(20) COMMENT '还本付息明细 ID. 0 表示自由还款记录',
    `actual_repayment_date` DATE COMMENT '实际还款日期',
    `actual_repayment_principal` BIGINT (20) COMMENT '实际还款本金，以分计算',
    `actual_repayment_interest` BIGINT (20) COMMENT '实际还款利息，以分计算',
    `actual_repayment_amount` BIGINT (20) COMMENT '实际还款总额，以分计算',
    `is_deleted` TINYINT (1) DEFAULT 0 COMMENT '是否删除. 0: 否, 1: 是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_repayment_record_id` (`id`)
  );

-- 存量融资担保记录
DROP TABLE IF EXISTS `fin_existing_guarantee`;

CREATE TABLE
  `fin_existing_guarantee` (
    `id` BIGINT(20) NOT NULL COMMENT '融资担保 ID',
    `existing_id` BIGINT(20) COMMENT '存量融资 ID',
    `guarantee_type` VARCHAR(64) COMMENT '担保类型',
    `is_credit` TINYINT (1) COMMENT '是否为信用担保. 0: 否, 1: 是',
    `fee_rate` DECIMAL(8, 4) COMMENT '担保费率',
    `guarantee_bonus` BIGINT (20) COMMENT '保证金，以分计算',
    `counter_guarantee_id` BIGINT(20) DEFAULT 0 COMMENT '反担保的担保 ID. 0 表示这行记录是担保，而不是反担保',
    `is_deleted` TINYINT (1) DEFAULT 0 COMMENT '是否删除. 0: 否, 1: 是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_guarantee_id` (`id`)
  );

-- 存量融资担保与担保物关系
DROP TABLE IF EXISTS `fin_existing_guarantee_asset`;

CREATE TABLE
  `fin_existing_guarantee_asset` (
    `id` BIGINT(20) NOT NULL COMMENT '融资担保与担保物关系 ID',
    `guarantee_id` BIGINT(20) COMMENT '融资担保 ID',
    `asset_id` BIGINT(20) COMMENT '担保物 ID',
    `comment` VARCHAR(256) COMMENT '备注',
    `is_deleted` TINYINT (1) DEFAULT 0 COMMENT '是否删除. 0: 否, 1: 是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_guarantee_asset_id` (`id`)
  );

-- 存量融资勾稽
DROP TABLE IF EXISTS `fin_existing_linkage`;

CREATE TABLE
  `fin_existing_linkage` (
    `id` BIGINT(20) NOT NULL COMMENT '融资勾稽 ID',
    `existing_id` BIGINT(20) COMMENT '存量融资 ID',
    `reserve_id` BIGINT(20) COMMENT '储备融资 ID',
    `linkage_amount` BIGINT (20) COMMENT '勾稽金额，以分计算',
    `is_deleted` TINYINT (1) DEFAULT 0 COMMENT '是否删除. 0: 否, 1: 是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_linkage_id` (`id`)
  );

-- 固定资产
DROP TABLE IF EXISTS `asset_fixed`;

CREATE TABLE
  `asset_fixed` (
    `id` BIGINT(20) NOT NULL COMMENT '固定资产ID',
    `name` VARCHAR(128) COMMENT '固定资产名称',
    `org_id` BIGINT(20) NOT NULL COMMENT '所属组织ID',
    `is_deleted` TINYINT (1) DEFAULT 0 COMMENT '是否删除. 0: 否, 1: 是',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_asset_fixed_id` (`id`)
  );