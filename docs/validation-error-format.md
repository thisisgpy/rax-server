# 验证错误信息格式

## 概述

项目已经配置了全局的ValidationPipe和异常过滤器，当DTO验证失败时，会返回详细的错误信息，而不是统一的"Bad Request Exception"。错误信息会直接设置在响应的 `message` 字段中，保持项目统一的响应格式。

## 错误响应格式

### 验证失败时的响应结构

```json
{
  "success": false,
  "message": "字段名: 错误信息1; 字段名2: 错误信息2",
  "data": null
}
```

## 示例

### 创建用户时的验证错误

**请求示例：**
```json
POST /api/v1/user/create
{
  "orgId": "abc",
  "mobile": "123",
  "name": "",
  "password": "12"
}
```

**响应示例：**
```json
{
  "success": false,
  "message": "orgId: 组织ID必须是数字; mobile: 手机号格式不正确; name: 用户名称不能为空; gender: 性别不能为空; idCard: 身份证号不能为空; password: 密码至少6个字符",
  "data": null
}
```

### 单个字段验证错误

**请求示例：**
```json
POST /api/v1/user/create
{
  "orgId": 1,
  "mobile": "13800138000",
  "name": "张三",
  "gender": "男",
  "idCard": "123456789012345678",
  "password": "12"
}
```

**响应示例：**
```json
{
  "success": false,
  "message": "password: 密码至少6个字符",
  "data": null
}
```

### 嵌套对象验证错误

对于包含嵌套对象的DTO，错误信息会以点号分隔的形式显示字段路径：

```json
{
  "success": false,
  "message": "address.street: 街道地址不能为空; address.city: 城市不能为空",
  "data": null
}
```

## 配置说明

### ValidationPipe 配置

在 `src/main.ts` 中配置：

```typescript
app.useGlobalPipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  disableErrorMessages: false,
  stopAtFirstError: false,
  exceptionFactory: (errors) => {
    const formatErrors = (validationErrors: any[]): string[] => {
      const result: string[] = [];
      
      validationErrors.forEach((error) => {
        const property = error.property;
        const constraints = error.constraints;
        
        if (constraints) {
          const messages = Object.values(constraints) as string[];
          messages.forEach(msg => {
            result.push(`${property}: ${msg}`);
          });
        }
        
        // 处理嵌套对象的验证错误
        if (error.children && error.children.length > 0) {
          const childrenErrors = formatErrors(error.children);
          childrenErrors.forEach(childError => {
            result.push(`${property}.${childError}`);
          });
        }
      });
      
      return result;
    };
    
    const errorMessages = formatErrors(errors);
    const message = errorMessages.join('; ');
    
    return new BadRequestException(message);
  }
}));
```

### 全局异常过滤器

在 `src/common/exceptions/global-exception.filter.ts` 中处理验证异常：

```typescript
if (exception instanceof BadRequestException) {
  const exceptionResponse = exception.getResponse() as any;
  
  if (typeof exceptionResponse === 'string') {
    // 自定义格式的验证错误（来自 ValidationPipe）
    message = exceptionResponse;
  } else if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
    // 默认的 class-validator 验证错误
    const errorMessages = this.formatValidationErrorsToString(exceptionResponse.message);
    message = errorMessages;
  } else if (typeof exceptionResponse.message === 'string') {
    message = exceptionResponse.message;
  } else {
    message = '请求参数错误';
  }
}
```

## 优势

1. **保持响应格式统一**：不破坏项目原有的响应数据结构
2. **详细的错误信息**：每个字段的验证错误都会明确指出
3. **易于解析**：前端可以直接显示message中的错误信息
4. **支持嵌套对象**：对于复杂的DTO结构，也能准确定位错误字段
5. **多个错误同时显示**：不会在第一个错误处停止，而是收集所有验证错误
6. **自定义错误消息**：通过decorator的message参数可以提供用户友好的错误提示

## 错误信息格式

- **单个错误**：`字段名: 错误信息`
- **多个错误**：`字段名1: 错误信息1; 字段名2: 错误信息2`
- **嵌套对象错误**：`对象名.字段名: 错误信息`

## 注意事项

1. 确保在DTO中使用class-validator装饰器时，都提供了清晰的中文错误消息
2. 对于复杂的验证规则，建议使用自定义验证器
3. 响应格式统一为HTTP 200状态码，通过success字段区分成功与失败
4. 错误信息会按照字段在DTO中的定义顺序显示
5. 前端可以根据需要解析message字段中的错误信息，或直接显示完整的错误消息 