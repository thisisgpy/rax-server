import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sys_bank')
export class SysBank {
    @ApiProperty({
        description: '联行号',
        type: String
    })
    @PrimaryColumn({ name: 'code', comment: '联行号' })
    code: string;

    @ApiProperty({
        description: '银行名称',
        type: String
    })
    @Column({ name: 'name', comment: '银行名称' })
    name: string;

    @ApiProperty({
        description: '银行名称简称',
        type: String
    })
    @Column({ name: 'name_abbr', comment: '银行名称简称' })
    nameAbbr: string;

    @ApiProperty({
        description: '省份',
        type: String
    })
    @Column({ name: 'province', comment: '省份' })
    province: string;

    @ApiProperty({
        description: '城市',
        type: String
    })
    @Column({ name: 'city', comment: '城市' })
    city: string;

    @ApiProperty({
        description: '支行名称',
        type: String
    })
    @Column({ name: 'branch_name', comment: '支行名称' })
    branchName: string;
} 