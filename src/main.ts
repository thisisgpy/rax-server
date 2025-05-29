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
    // 验证失败时停止第一个错误
    stopAtFirstError: false,
    // 自定义错误消息格式
    exceptionFactory: (errors) => {
      const result = errors.map((error) => {
        const constraints = error.constraints;
        const messages = constraints ? Object.values(constraints) : [];
        return `${error.property} ${messages.join(', ')}`;
      });
      return new BadRequestException(result);
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
