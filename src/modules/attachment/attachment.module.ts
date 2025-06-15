import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SysAttachment } from '../../entities/sysAttachment.entity';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { ContextModule } from '../../common/context/context.module';
import { SnowflakeModule } from '../../common/providers/snowflake.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SysAttachment]),
        ConfigModule,         // Configuration service - REQUIRED for file upload
        ContextModule,        // UserContext - REQUIRED
        SnowflakeModule,      // ID generator - REQUIRED  
        LoggerModule,         // Logging service - REQUIRED
    ],
    controllers: [AttachmentController],  // 提供文件上传接口
    providers: [AttachmentService],
    exports: [AttachmentService]
})
export class AttachmentModule {} 