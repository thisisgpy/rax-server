import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { numberTransformer } from '../common/utils/transformers';

@Entity('sys_role_resource')
export class SysRoleResource {
    @ApiProperty({
        description: '角色资源关系ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        comment: '角色资源关系ID',
        transformer: numberTransformer
    })
    id: number;

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

    @ApiProperty({
        description: '资源ID',
        type: Number
    })
    @Column({
        name: 'resource_id',
        type: 'bigint',
        comment: '资源ID',
        transformer: numberTransformer
    })
    resourceId: number;
} 