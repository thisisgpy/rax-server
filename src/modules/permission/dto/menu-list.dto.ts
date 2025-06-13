import { ApiProperty } from '@nestjs/swagger';

export class MenuMetaDto {
  @ApiProperty({ description: '菜单名称' })
  title: string;

  @ApiProperty({ description: '菜单图标', required: false })
  icon?: string;

  @ApiProperty({ description: '是否在菜单中隐藏', required: false })
  isHide?: boolean;

  @ApiProperty({ description: '是否缓存' })
  keepAlive: boolean;

  @ApiProperty({ description: '可操作权限', type: [String], required: false })
  authList?: Array<string>;
}

export class MenuListDto {
  @ApiProperty({ description: '菜单ID' })
  id: number;

  @ApiProperty({ description: '路由路径' })
  path: string;

  @ApiProperty({ description: '组件名称' })
  name: string;

  @ApiProperty({ description: '组件加载路径', required: false })
  component?: string;

  @ApiProperty({ description: '菜单元信息', type: MenuMetaDto })
  meta: MenuMetaDto;

  @ApiProperty({ description: '子菜单', type: [MenuListDto], required: false })
  children?: MenuListDto[];
}

export interface MenuListType {
  id: number;
  path: string; // 路由路径
  name: string; // 组件名称
  component?: string; // 组件加载路径
  meta: {
    title: string; // 菜单名称
    icon?: string; // 菜单图标
    isHide?: boolean; // 是否在菜单中隐藏
    keepAlive: boolean; // 是否缓存
    authList?: Array<string>; // 可操作权限
  };
  children?: MenuListType[]; // 子菜单
} 