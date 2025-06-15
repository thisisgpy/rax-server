import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAttachmentDto } from './create-attachment.dto';

export class BatchCreateAttachmentDto {
    @ApiProperty({
        description: '附件列表',
        type: [CreateAttachmentDto],
        isArray: true
    })
    @IsArray({ message: '附件列表必须是数组' })
    @ValidateNested({ each: true })
    @Type(() => CreateAttachmentDto)
    attachments: CreateAttachmentDto[];
} 