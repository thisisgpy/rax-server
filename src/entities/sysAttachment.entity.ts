import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('sys_attachment')
export class SysAttachment {
    @ApiProperty({
        description: '附件ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        comment: '附件 ID',
        transformer: numberTransformer
    })
    id: number;

    @ApiProperty({
        description: '业务模块名称',
        type: String,
        maxLength: 64,
        required: false
    })
    @Column({
        name: 'biz_module',
        type: 'varchar',
        length: 64,
        nullable: true,
        comment: '业务模块名称'
    })
    bizModule: string | null;

    @ApiProperty({
        description: '业务数据ID',
        type: Number,
        required: false
    })
    @Column({
        name: 'biz_id',
        type: 'bigint',
        nullable: true,
        comment: '业务数据 ID',
        transformer: numberTransformer
    })
    bizId: number | null;

    @ApiProperty({
        description: '原文件名',
        type: String,
        maxLength: 128,
        required: false
    })
    @Column({
        name: 'original_name',
        type: 'varchar',
        length: 128,
        nullable: true,
        comment: '原文件名'
    })
    originalName: string;

    @ApiProperty({
        description: '存储文件名',
        type: String,
        maxLength: 128,
        required: false
    })
    @Column({
        name: 'saved_name',
        type: 'varchar',
        length: 128,
        nullable: true,
        comment: '存储文件名'
    })
    savedName: string;

    @ApiProperty({
        description: '文件扩展名',
        type: String,
        maxLength: 32,
        required: false
    })
    @Column({
        name: 'extension',
        type: 'varchar',
        length: 32,
        nullable: true,
        comment: '文件扩展名'
    })
    extension: string;

    @ApiProperty({
        description: '文件大小(字节)',
        type: Number,
        required: false
    })
    @Column({
        name: 'file_size',
        type: 'bigint',
        nullable: true,
        comment: '文件大小. 以byte为单位',
        transformer: numberTransformer
    })
    fileSize: number;

    @ApiProperty({
        description: '是否删除',
        type: Boolean,
        required: false
    })
    @Column({
        name: 'is_deleted',
        type: 'tinyint',
        width: 1,
        default: 0,
        comment: '是否删除. 0:否, 1:是',
        transformer: booleanTransformer
    })
    isDeleted: boolean;

    @ApiProperty({
        description: '创建时间',
        type: Date
    })
    @CreateDateColumn({
        name: 'create_time',
        type: 'timestamp',
        comment: '创建时间'
    })
    createTime: Date;

    @ApiProperty({
        description: '创建人',
        type: String,
        maxLength: 32
    })
    @Column({
        name: 'create_by',
        type: 'varchar',
        length: 32,
        comment: '创建人'
    })
    createBy: string;
} 