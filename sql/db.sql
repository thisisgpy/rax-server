-- 组织
DROP TABLE IF EXISTS `sys_org`;
CREATE TABLE
    `sys_org`
(
    `id`          VARCHAR(64) NOT NULL COMMENT '组织ID',
    `code`        VARCHAR(64) NOT NULL COMMENT '组织编码. 4位一级. 0001,00010001,000100010001,以此类推',
    `name`        VARCHAR(64) NOT NULL COMMENT '组织名称',
    `name_abbr`   VARCHAR(64) NOT NULL COMMENT '组织名称简称',
    `comment`     VARCHAR(128) COMMENT '组织备注',
    `parent_id`   VARCHAR(64) DEFAULT '0' COMMENT '父级组织ID. 0表示没有父组织',
    `create_time` DATETIME    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by`   VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by`   VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_org_id` (`id`)
);

-- 字典
DROP TABLE IF EXISTS `sys_dict`;
CREATE TABLE
    `sys_dict`
(
    `id`          VARCHAR(64) COMMENT '字典ID',
    `code`        VARCHAR(64) UNIQUE NOT NULL COMMENT '字典编码',
    `name`        VARCHAR(64) UNIQUE NOT NULL COMMENT '字典名称',
    `comment`     VARCHAR(128) COMMENT '字典备注',
    `is_enabled`  TINYINT(1) DEFAULT 1 COMMENT '是否启用. 0: 禁用, 1: 启用',
    `create_time` DATETIME   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by`   VARCHAR(32)        NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by`   VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_dict_id` (`id`)
);

-- 字典项
DROP TABLE IF EXISTS `sys_dict_item`;
CREATE TABLE
    `sys_dict_item`
(
    `id`          VARCHAR(64) COMMENT '字典项ID',
    `dict_id`     VARCHAR(64) NOT NULL COMMENT '字典ID',
    `dict_code`   VARCHAR(64) NOT NULL COMMENT '字典编码',
    `label`       VARCHAR(64) NOT NULL COMMENT '字典项标签',
    `value`       VARCHAR(64) NOT NULL COMMENT '字典项值',
    `comment`     VARCHAR(128) COMMENT '字典项备注',
    `sort`        INT(11)     DEFAULT 0 COMMENT '字典项排序',
    `parent_id`   VARCHAR(64) DEFAULT 0 COMMENT '父级字典项ID. 0表示没有父级字典项',
    `is_enabled`  TINYINT(1)  DEFAULT 1 COMMENT '是否启用,不对子级生效. 0: 禁用, 1: 启用',
    `create_time` DATETIME    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by`   VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by`   VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_dict_item_id` (`id`)
);

-- 银行
DROP TABLE IF EXISTS `sys_bank`;
CREATE TABLE
    `sys_bank`
(
    `code`        VARCHAR(64) COMMENT '联行号',
    `name`        VARCHAR(64) COMMENT '银行名称',
    `name_abbr`   VARCHAR(64) COMMENT '银行名称简称',
    `province`    VARCHAR(64) COMMENT '省份',
    `city`        VARCHAR(64) COMMENT '城市',
    `branch_name` VARCHAR(64) COMMENT '支行名称',
    PRIMARY KEY `pk_bank_code` (`code`)
);

-- 储备融资
DROP TABLE IF EXISTS `fin_reserve`;
CREATE TABLE
    `fin_reserve`
(
    `id`                         VARCHAR(64) COMMENT '储备融资 ID',
    `code`                       VARCHAR(64) COMMENT '储备融资编码.编码规则: RF 开头，后面跟 yyMMddHHmmss',
    `org_id`                     VARCHAR(64) COMMENT '融资主体 ID',
    `financial_institution`      VARCHAR(64) COMMENT '金融机构',
    `funding_mode`               VARCHAR(64) COMMENT '融资方式',
    `funding_amount`             BIGINT(20) COMMENT '融资金额，以分计算',
    `expected_disbursement_date` DATE COMMENT '预计放款日期',
    `loan_renewal_from_id`       VARCHAR(64) COMMENT '续贷来源 ID.0 表示非续贷',
    `leader_name`                VARCHAR(64) COMMENT '负责人名称',
    `leader_id`                  VARCHAR(64) COMMENT '负责人 ID',
    `executor_name`              VARCHAR(64) COMMENT '执行人名称',
    `executor_id`                VARCHAR(64) COMMENT '执行人 ID',
    `combined_ratio`             DECIMAL(6, 2) COMMENT '综合成本率',
    `additional_costs`           BIGINT(20) COMMENT '额外成本，以分计算',
    `status`                     TINYINT(2) COMMENT '状态. 0:待放款, 1:已放款, 2:已取消',
    `create_time`                DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by`                  VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time`                DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by`                  VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_reserve_id` (`id`)
);

-- 储备融资成本
DROP TABLE IF EXISTS `fin_reserve_costs`;
CREATE TABLE
    `fin_reserve_costs`
(
    `id`          VARCHAR(64) COMMENT '储备融资成本 ID',
    `reserve_id`  VARCHAR(64) COMMENT '储备融资 ID',
    `cost_type`   VARCHAR(64) COMMENT '成本类型',
    `cost_amount` VARCHAR(64) COMMENT '成本数据.可能是数字、百分比、文字',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by`   VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by`   VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_reserve_costs_id` (`id`)
);

-- 储备融资进度
DROP TABLE IF EXISTS `fin_reserve_progress`;
CREATE TABLE
    `fin_reserve_progress`
(
    `id`            VARCHAR(64) COMMENT '储备融资进度 ID',
    `reserve_id`    VARCHAR(64) COMMENT '储备融资 ID',
    `progress_name` VARCHAR(64) COMMENT '进度名称',
    `plan_date`     DATE COMMENT '计划日期',
    `actual_date`   DATE COMMENT '实际日期',
    `delay_days`    INT(11) COMMENT '延期天数',
    `update_time`   DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by`     VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_reserve_progress_id` (`id`)
);

-- 储备融资进度报告
DROP TABLE IF EXISTS `fin_reserve_progress_report`;
CREATE TABLE
    `fin_reserve_progress_report`
(
    `id`             VARCHAR(64) COMMENT '储备融资进度报告 ID',
    `reserve_id`     VARCHAR(64) COMMENT '储备融资 ID',
    `report_content` VARCHAR(512) COMMENT '报告内容',
    `create_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by`      VARCHAR(32) NOT NULL COMMENT '创建人',
    `create_by_id`   VARCHAR(64) COMMENT '创建人 ID',
    PRIMARY KEY `pk_reserve_progress_report_id` (`id`)
);

-- 存量融资
DROP TABLE IF EXISTS `fin_existing`;
CREATE TABLE
    `fin_existing`
(
    `id`                    VARCHAR(64) COMMENT '存量融资 ID',
    `code`                  VARCHAR(64) COMMENT '存量融资编码. 编码规则: EF 开头，后面跟 yyMMddHHmmss',
    `reserve_id`            VARCHAR(64) COMMENT '储备融资 ID. 0 表示非储备融资转入',
    `org_id`                VARCHAR(64) COMMENT '融资主体 ID',
    `org_code`              VARCHAR(64) COMMENT '融资主体编码',
    `fin_name`              VARCHAR(64) COMMENT '融资名称',
    `funding_structure`     VARCHAR(64) COMMENT '融资结构',
    `funding_mode`          VARCHAR(64) COMMENT '融资方式',
    `financial_institution` VARCHAR(64) COMMENT '金融机构',
    `funding_amount`        BIGINT(20) COMMENT '融资总额，以分计算',

    `return_interest_rate`    DECIMAL(8, 4) COMMENT '回报利率',
    `repayment_period`        TINYINT(2) COMMENT '还款周期.1:月,2:季,3:半年,4:年,5:到期一次性付,6:自行协商',
    `repayment_method`        TINYINT(2) COMMENT '还款方式.1:等额本息,2:分期还本付息,3:先息后本,4:到期一次性还本付息,5:其他',
    `interest_type`           TINYINT(2) COMMENT '利息类型.1:固定利率,2:浮动利率',
    `loan_prime_rate`         DECIMAL(8, 4) COMMENT '基准利率',
    `basis_point`             DECIMAL(8, 4) COMMENT '基点',
    `days_count_basis`        TINYINT(2) COMMENT '计息基准.1:ACT/365,2:ACT/366,3:ACT/360,4:30/360',
    `include_settlement_date` TINYINT(1) DEFAULT 0 COMMENT '结息日当日是否计息. 0: 否, 1: 是',
    `repayment_delay_days`    INT(11)    DEFAULT 0 COMMENT '还款日相对于结息日的延迟天数',

    `loan_renewal_from_id`  VARCHAR(64) COMMENT '续贷来源 ID.0 表示非续贷',
    `is_multiple`           TINYINT(1) DEFAULT 0 COMMENT '是否为多次放款. 0: 否, 1: 是',
    `fin_term`              INT(11) COMMENT '融资期限，以月为单位',
    `is_public`             TINYINT(1) DEFAULT 0 COMMENT '是否为公开融资. 0: 否, 1: 是',
    `create_time`           DATETIME   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by`             VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time`           DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by`             VARCHAR(32) COMMENT '信息更新人',
    `is_deleted`            TINYINT(1) DEFAULT 0 COMMENT '是否删除. 0: 否, 1: 是',
    PRIMARY KEY `pk_fin_existing_id` (`id`)
);

-- 融资放款
DROP TABLE IF EXISTS `fin_existing_disbursement`;
CREATE TABLE
    `fin_existing_disbursement`
(
    `id`                      VARCHAR(64) COMMENT '融资放款 ID',
    `existing_id`             VARCHAR(64) COMMENT '存量融资 ID',
    `amount`                  BIGINT(20) COMMENT '放款金额，以分计算',
    `accounting_date`         DATE COMMENT '到账日期',
    `disbursement_method`     VARCHAR(64) COMMENT '放款方式',
    `interest_start_date`     DATE COMMENT '起息日',
    `first_repayment_date`    DATE COMMENT '首次还款日',
    `last_repayment_date`     DATE COMMENT '最后还款日',
    `create_time`             DATETIME   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by`               VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time`             DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by`               VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_disbursement_id` (`id`)
);

-- 还本付息计划
DROP TABLE IF EXISTS `fin_existing_repayment`;
CREATE TABLE
    `fin_existing_repayment`
(
    `id`                      VARCHAR(64) COMMENT '还本付息计划 ID',
    `existing_id`             VARCHAR(64) COMMENT '存量融资 ID',
    `period`                  INT(11) COMMENT '期数',
    `interest_settle_date`    DATE COMMENT '结息日',
    `interest_calculate_date` INT(11) COMMENT '计息天数',
    `repayment_date`          DATE COMMENT '还款日期',
    `actual_repayment_date`   DATE COMMENT '实际还款日期',
    `repayment_principal`     BIGINT(20) COMMENT '还款本金，以分计算',
    `repayment_interest`      BIGINT(20) COMMENT '还款利息，以分计算',
    `repayment_amount`        BIGINT(20) COMMENT '还款总额，以分计算',
    `is_repaid`               TINYINT(1) DEFAULT 0 COMMENT '是否已还款. 0: 否, 1: 是',
    `create_time`             DATETIME   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by`               VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time`             DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by`               VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_repayment_id` (`id`)
);

-- 融资放款与还本付息计划关系
DROP TABLE IF EXISTS `fin_existing_disbursement_repayment_rel`;
CREATE TABLE
    `fin_existing_disbursement_repayment_rel`
(
    `id` VARCHAR(64) COMMENT '关系 ID',
    `existing_id` VARCHAR(64) COMMENT '存量融资 ID',
    `disbursement_id` VARCHAR(64) COMMENT '融资放款 ID',
    `repayment_id` VARCHAR(64) COMMENT '还本付息计划 ID',
    PRIMARY KEY `pk_fin_existing_disbursement_repayment_rel_id` (`id`)
);

-- 融资担保
DROP TABLE IF EXISTS `fin_existing_guarantee`;
CREATE TABLE
    `fin_existing_guarantee`
(
    `id`                   VARCHAR(64) COMMENT '融资担保 ID',
    `existing_id`          VARCHAR(64) COMMENT '存量融资 ID',
    `guarantee_type`       VARCHAR(64) COMMENT '担保类型. 1: 抵押, 2: 质押, 3: 保证, 4: 其他',
    `is_credit`            TINYINT(1) COMMENT '是否为信用担保. 0: 否, 1: 是',
    `fee_rate`             DECIMAL(8, 4) COMMENT '担保费率',
    `guarantee_bonus`      BIGINT(20) COMMENT '保证金，以分计算',
    `counter_guarantee_id` VARCHAR(64) DEFAULT '0' COMMENT '反担保的担保 ID. 0 表示这行记录是担保，而不是反担保',
    `create_time`          DATETIME    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by`            VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time`          DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by`            VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_guarantee_id` (`id`)
);

-- 融资担保与担保物关系
DROP TABLE IF EXISTS `fin_existing_guarantee_asset`;
CREATE TABLE
    `fin_existing_guarantee_asset`
(
    `id` VARCHAR(64) COMMENT '融资担保与担保物关系 ID',
    `guarantee_id` VARCHAR(64) COMMENT '融资担保 ID',
    `asset_id` VARCHAR(64) COMMENT '担保物 ID',
    PRIMARY KEY `pk_fin_existing_guarantee_asset_id` (`id`)
);

-- 融资勾稽
DROP TABLE IF EXISTS `fin_existing_linkage`;
CREATE TABLE
    `fin_existing_linkage`
(
    `id`             VARCHAR(64) COMMENT '融资勾稽 ID',
    `existing_id`    VARCHAR(64) COMMENT '存量融资 ID',
    `reserve_id`     VARCHAR(64) COMMENT '储备融资 ID',
    `linkage_amount` BIGINT(20) COMMENT '勾稽金额，以分计算',
    `create_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by`      VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time`    DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by`      VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_fin_existing_linkage_id` (`id`)
);