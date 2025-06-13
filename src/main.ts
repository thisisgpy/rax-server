import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DateFormatInterceptor } from './common/interceptors/date-format.interceptor';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局异常过滤器
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // 全局拦截器
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new DateFormatInterceptor()
  );
  
  // 全局验证管道 - 配置详细的错误信息
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    // 启用详细错误信息
    disableErrorMessages: false,
    // 验证失败时不停止第一个错误，收集所有错误
    stopAtFirstError: false,
    // 自定义错误消息格式
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

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('RAX Server API')
    .setDescription('RAX Server API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/json',
    swaggerOptions: {
      persistAuthorization: true
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
