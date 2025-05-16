-- 组织
DROP TABLE IF EXISTS `sys_org`;
CREATE TABLE
    `sys_org`
(
    `id`          VARCHAR(64)  NOT NULL COMMENT '组织ID',
    `code`        VARCHAR(64) NOT NULL COMMENT '组织编码. 4位一级. 0001,00010001,000100010001,以此类推',
    `name`        VARCHAR(64) NOT NULL COMMENT '组织名称',
    `name_abbr`   VARCHAR(64) NOT NULL COMMENT '组织名称简称',
    `comment`     VARCHAR(128) COMMENT '组织备注',
    `parent_id`   VARCHAR(64) DEFAULT '0' COMMENT '父级组织ID. 0表示没有父组织',
    `create_time` DATETIME   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
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
    `sort`        INT(11)    DEFAULT 0 COMMENT '字典项排序',
    `parent_id`   VARCHAR(64)    DEFAULT 0 COMMENT '父级字典项ID. 0表示没有父级字典项',
    `is_enabled`  TINYINT(1) DEFAULT 1 COMMENT '是否启用,不对子级生效. 0: 禁用, 1: 启用',
    `create_time` DATETIME   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
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
    `code`          VARCHAR(64) COMMENT '联行号',
    `name`          VARCHAR(64) COMMENT '银行名称',
    `name_abbr`     VARCHAR(64) COMMENT '银行名称简称',
    `province`      VARCHAR(64) COMMENT '省份',
    `city`          VARCHAR(64) COMMENT '城市',
    `branch_name`   VARCHAR(64) COMMENT '支行名称',
    PRIMARY KEY `pk_bank_code` (`code`)
);

-- 储备融资
DROP TABLE IF EXISTS `fin_reserve`;
CREATE TABLE
    `fin_reserve`
(
    `id`          VARCHAR(64) COMMENT '储备融资 ID',
    `code`        VARCHAR(64) COMMENT '储备融资编码.编码规则: RF 开头，后面跟 yyMMddHHmmss',
    `org_id`      VARCHAR(64) COMMENT '融资主体 ID',
    `financial_institution` VARCHAR(64) COMMENT '金融机构',
    `funding_mode` VARCHAR(64) COMMENT '融资方式',
    `funding_amount` BIGINT(20) COMMENT '融资金额，以分计算',
    `expected_disbursement_date` DATE COMMENT '预计放款日期',
    `loan_renewal_from_id` VARCHAR(64) COMMENT '续贷来源 ID.0 表示非续贷',
    `leader_name` VARCHAR(64) COMMENT '负责人名称',
    `leader_id` VARCHAR(64) COMMENT '负责人 ID',
    `executor_name` VARCHAR(64) COMMENT '执行人名称',
    `executor_id` VARCHAR(64) COMMENT '执行人 ID',
    `combined_ratio` DECIMAL(6, 2) COMMENT '综合成本率',
    `additional_costs` BIGINT(20) COMMENT '额外成本，以分计算',
    `status` TINYINT(2) COMMENT '状态. 0:待放款, 1:已放款, 2:已取消',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_reserve_id` (`id`)
);

-- 储备融资成本
DROP TABLE IF EXISTS `fin_reserve_costs`;
CREATE TABLE
    `fin_reserve_costs`
(
    `id` VARCHAR(64) COMMENT '储备融资成本 ID',
    `reserve_id` VARCHAR(64) COMMENT '储备融资 ID',
    `cost_type` VARCHAR(64) COMMENT '成本类型',
    `cost_amount` VARCHAR(64) COMMENT '成本数据.可能是数字、百分比、文字',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_reserve_costs_id` (`id`)
);

-- 储备融资进度
DROP TABLE IF EXISTS `fin_reserve_progress`;
CREATE TABLE
    `fin_reserve_progress`
(
    `id` VARCHAR(64) COMMENT '储备融资进度 ID',
    `reserve_id` VARCHAR(64) COMMENT '储备融资 ID',
    `progress_name` VARCHAR(64) COMMENT '进度名称',
    `plan_date` DATE COMMENT '计划日期',
    `actual_date` DATE COMMENT '实际日期',
    `delay_days` INT(11) COMMENT '延期天数',
    `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '信息更新时间',
    `update_by` VARCHAR(32) COMMENT '信息更新人',
    PRIMARY KEY `pk_reserve_progress_id` (`id`)
);

-- 储备融资进度报告
DROP TABLE IF EXISTS `fin_reserve_progress_report`;
CREATE TABLE
    `fin_reserve_progress_report`
(
    `id` VARCHAR(64) COMMENT '储备融资进度报告 ID',
    `reserve_id` VARCHAR(64) COMMENT '储备融资 ID',
    `report_content` VARCHAR(512) COMMENT '报告内容',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` VARCHAR(32) NOT NULL COMMENT '创建人',
    `create_by_id` VARCHAR(64) COMMENT '创建人 ID',
    PRIMARY KEY `pk_reserve_progress_report_id` (`id`)
);