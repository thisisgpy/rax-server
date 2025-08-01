import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SysOrgModule } from './modules/sysOrg/sysOrg.module';
import { AppConfigModule } from './config/config.module';
import { ContextModule } from './common/context/context.module';
import { SnowflakeModule } from './common/providers/snowflake.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { SysDictModule } from './modules/sysDict/sysDict.module';
import { SysBankModule } from './modules/sysBank/sysBank.module';
import { LoggerModule } from './common/logger/logger.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { AssetFixedModule } from './modules/assetFixed/assetFixed.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { FinExistingModule } from './modules/finExisting/finExisting.module';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    ContextModule,
    SnowflakeModule,
    SysOrgModule,
    SysDictModule,
    SysBankModule,
    LoggerModule,
    UserModule,
    RoleModule,
    PermissionModule,
    AssetFixedModule,
    AttachmentModule,
    FinExistingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');
  }
}
