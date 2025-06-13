import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { numberTransformer } from '../common/utils/transformers';

@Entity('sys_user_role')
export class SysUserRole {
    @ApiProperty({
        description: '用户角色关系ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        comment: '用户角色关系ID',
        transformer: numberTransformer
    })
    id: number;

    @ApiProperty({
        description: '用户ID',
        type: Number
    })
    @Column({
        name: 'user_id',
        type: 'bigint',
        comment: '用户ID',
        transformer: numberTransformer
    })
    userId: number;

    @ApiProperty({
        description: '角色ID',
        type: Number
    })
    @Column({
        name: 'role_id',
        type: 'bigint',
        comment: '角色ID',
        transformer: numberTransformer
    })
    roleId: number;
} 