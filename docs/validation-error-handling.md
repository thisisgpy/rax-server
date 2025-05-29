# 验证错误处理改进

## 概述

为了提供更友好的 API 错误信息，我们对 finExisting 模块的验证错误处理进行了以下改进：

## 改进内容

### 1. 全局异常过滤器

创建了 `GlobalExceptionFilter` 来统一处理各种异常：

- **验证错误**：将 class-validator 的验证错误转换为结构化的错误信息
- **HTTP 异常**：统一处理其他 HTTP 异常
- **普通错误**：处理未预期的错误

### 2. 详细的验证错误消息

为所有 DTO 字段添加了中文错误消息：

- ✅ `CreateFinExistingDto`：创建存量融资的验证消息
- ✅ `UpdateFinExistingDto`：更新存量融资的验证消息
- ✅ `CreateFinExistingGuaranteeDto`：创建担保记录的验证消息
- ✅ `UpdateFinExistingGuaranteeDto`：更新担保记录的验证消息
- ✅ `SearchFinExistingDto`：搜索条件的验证消息
- ℹ️ `FinExistingListItemDto`：响应 DTO，无需验证
- ℹ️ `FinExistingGuaranteeDto`：响应 DTO，无需验证
- ℹ️ `FinExistingGuaranteeAssetDto`：响应 DTO，无需验证

### 3. 统一的响应格式

所有错误响应都遵循统一格式：

```json
{
  "success": false,
  "message": "参数验证失败",
  "data": null,
  "errors": {
    "fieldName": ["错误消息1", "错误消息2"],
    "anotherField": ["错误消息"]
  }
}
```

## 测试示例

### 测试创建存量融资验证错误

发送一个无效的创建存量融资请求：

```bash
curl -X POST http://localhost:3000/api/v1/fin/existing/create \
  -H "Content-Type: application/json" \
  -d '{
    "reserveId": "",
    "orgId": 123,
    "fundingAmount": "invalid_amount",
    "returnInterestRate": "not_a_number",
    "finTerm": 0
  }'
```

期望的响应：

```json
{
  "success": false,
  "message": "参数验证失败",
  "data": null,
  "errors": {
    "reserveId": ["储备融资ID不能为空"],
    "orgId": ["融资主体ID必须是字符串类型"],
    "orgCode": ["融资主体编码不能为空"],
    "finName": ["融资名称不能为空"],
    "fundingStructure": ["融资结构不能为空"],
    "fundingMode": ["融资方式不能为空"],
    "financialInstitution": ["金融机构不能为空"],
    "fundingAmount": ["融资总额格式不正确，应为正数且最多支持 6 位小数"],
    "returnInterestRate": ["回报利率必须是数字类型，最多支持 4 位小数"],
    "finTerm": ["融资期限必须大于等于1个月"]
  }
}
```

### 测试更新存量融资验证错误

发送一个无效的更新存量融资请求：

```bash
curl -X POST http://localhost:3000/api/v1/fin/existing/edit \
  -H "Content-Type: application/json" \
  -d '{
    "id": "",
    "fundingAmount": "-100",
    "returnInterestRate": "invalid",
    "finTerm": -5
  }'
```

期望的响应：

```json
{
  "success": false,
  "message": "参数验证失败",
  "data": null,
  "errors": {
    "id": ["存量融资ID不能为空"],
    "fundingAmount": ["融资总额格式不正确，应为正数且最多支持 6 位小数"],
    "returnInterestRate": ["回报利率必须是数字类型，最多支持 4 位小数"],
    "finTerm": ["融资期限必须大于等于1个月"]
  }
}
```

### 测试担保验证错误

发送一个无效的创建担保请求：

```bash
curl -X POST http://localhost:3000/api/v1/fin/existing/guarantee/create \
  -H "Content-Type: application/json" \
  -d '{
    "existingId": "",
    "guaranteeType": "",
    "feeRate": "invalid",
    "guaranteeBonus": "-100",
    "assetIds": [123, "valid_id"]
  }'
```

期望的响应：

```json
{
  "success": false,
  "message": "参数验证失败",
  "data": null,
  "errors": {
    "existingId": ["存量融资ID不能为空"],
    "guaranteeType": ["担保类型不能为空"],
    "feeRate": ["担保费率必须是数字类型，最多支持 4 位小数"],
    "guaranteeBonus": ["保证金格式不正确，应为正数且最多支持 6 位小数"],
    "assetIds": ["担保物ID必须是字符串类型"]
  }
}
```

### 测试搜索条件验证错误

发送一个无效的搜索请求：

```bash
curl -X POST http://localhost:3000/api/v1/fin/existing/search \
  -H "Content-Type: application/json" \
  -d '{
    "pageNo": 0,
    "pageSize": 200,
    "fundingAmountMin": "invalid",
    "finTermMin": -1,
    "isMultiple": "yes"
  }'
```

期望的响应：

```json
{
  "success": false,
  "message": "参数验证失败",
  "data": null,
  "errors": {
    "pageNo": ["页码必须大于等于1"],
    "pageSize": ["每页条数不能超过100"],
    "fundingAmountMin": ["融资总额最小值格式不正确，应为正数且最多支持 6 位小数"],
    "finTermMin": ["融资期限最小值必须大于等于0"],
    "isMultiple": ["是否为多次放款必须是布尔类型"]
  }
}
```

## 配置说明

### main.ts 配置

```typescript
// 全局异常过滤器
app.useGlobalFilters(new GlobalExceptionFilter());

// 全局验证管道 - 配置详细的错误信息
app.useGlobalPipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  disableErrorMessages: false,
  stopAtFirstError: false,
  exceptionFactory: (errors) => {
    const result = errors.map((error) => {
      const constraints = error.constraints;
      const messages = constraints ? Object.values(constraints) : [];
      return `${error.property} ${messages.join(', ')}`;
    });
    return new BadRequestException(result);
  }
}));
```

### DTO 验证消息示例

#### 基本字段验证

```typescript
@ApiProperty({ description: '融资名称' })
@IsString({ message: '融资名称必须是字符串类型' })
@IsNotEmpty({ message: '融资名称不能为空' })
finName: string;
```

#### 数字类型验证

```typescript
@ApiProperty({ description: '回报利率，支持 4 位小数' })
@IsNumber({ maxDecimalPlaces: 4 }, { message: '回报利率必须是数字类型，最多支持 4 位小数' })
returnInterestRate: number;
```

#### 正则表达式验证

```typescript
@ApiProperty({ description: '融资总额，以万元为单位，支持 6 位小数' })
@IsString({ message: '融资总额必须是字符串类型' })
@IsNotEmpty({ message: '融资总额不能为空' })
@Matches(/^\d+(\.\d{1,6})?$/, {
  message: '融资总额格式不正确，应为正数且最多支持 6 位小数'
})
fundingAmount: string;
```

#### 数组验证

```typescript
@ApiProperty({ description: '担保物 ID 数组', type: [String], required: false })
@IsOptional()
@IsArray({ message: '担保物ID必须是数组类型' })
@IsString({ each: true, message: '担保物ID必须是字符串类型' })
assetIds?: string[];
```

#### 范围验证

```typescript
@ApiProperty({ description: '融资期限，以月为单位' })
@IsInt({ message: '融资期限必须是整数类型' })
@IsNotEmpty({ message: '融资期限不能为空' })
@Min(1, { message: '融资期限必须大于等于1个月' })
finTerm: number;
```

## 验证规则覆盖情况

### 已完成的 DTO 文件

| DTO 文件 | 状态 | 说明 |
|---------|------|------|
| `create-fin-existing.dto.ts` | ✅ 已完成 | 创建存量融资的所有字段都有中文验证消息 |
| `update-fin-existing.dto.ts` | ✅ 已完成 | 更新存量融资的所有字段都有中文验证消息 |
| `create-fin-existing-guarantee.dto.ts` | ✅ 已完成 | 创建担保记录的所有字段都有中文验证消息 |
| `update-fin-existing-guarantee.dto.ts` | ✅ 已完成 | 更新担保记录的所有字段都有中文验证消息 |
| `search-fin-existing.dto.ts` | ✅ 已完成 | 搜索条件的所有字段都有中文验证消息 |
| `fin-existing-list.dto.ts` | ℹ️ 无需处理 | 响应 DTO，仅用于返回数据 |
| `fin-existing-guarantee.dto.ts` | ℹ️ 无需处理 | 响应 DTO，仅用于返回数据 |
| `fin-existing-guarantee-asset.dto.ts` | ℹ️ 无需处理 | 响应 DTO，仅用于返回数据 |

### 验证规则类型统计

- **字符串验证**：`@IsString()` + `@IsNotEmpty()` 或 `@IsOptional()`
- **数字验证**：`@IsNumber()` + `@IsInt()` + `@Min()` + `@Max()`
- **布尔验证**：`@IsBoolean()`
- **正则验证**：`@Matches()` 用于金额格式验证
- **数组验证**：`@IsArray()` + `@IsString({ each: true })`
- **嵌套验证**：`@ValidateNested()` + `@Type()`

## 优势

1. **用户友好**：提供具体的中文错误信息，而不是通用的 "Bad Request"
2. **结构化**：错误信息按字段分组，便于前端处理
3. **一致性**：所有 API 的错误响应格式统一
4. **可维护性**：集中的异常处理逻辑，便于维护和扩展
5. **完整性**：覆盖了所有需要验证的 DTO 文件

## 注意事项

1. 确保所有新增的 DTO 都添加了适当的验证消息
2. 验证消息应该简洁明了，便于用户理解
3. 对于敏感信息，避免在错误消息中暴露过多细节
4. 响应 DTO 不需要添加验证规则，因为它们只用于返回数据
5. 数组类型的验证需要同时使用 `@IsArray()` 和 `@IsString({ each: true })` 