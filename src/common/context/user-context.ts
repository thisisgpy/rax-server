import { Injectable, Scope } from '@nestjs/common';

export interface UserInfo {
    id: string;
    username: string;
    orgId?: string;
    orgCode?: string;
    roles?: string[];
    permissions?: string[];
}

@Injectable({ scope: Scope.REQUEST })
export class UserContext {
    private user: UserInfo | null = null;

    /**
     * 设置当前用户信息
     * @param userInfo 用户信息
     */
    setUser(user: UserInfo): void {
        this.user = user;
    }

    /**
     * 设置当前用户ID
     * @param id 用户ID
     */
    setUserId(id: string): void {
        if (!this.user) {
            this.user = { id, username: '' };
        } else {
            this.user.id = id;
        }
    }

    /**
     * 设置当前用户名
     * @param username 用户名
     */
    setUsername(username: string): void {
        if (!this.user) {
            this.user = { id: '', username };
        } else {
            this.user.username = username;
        }
    }

    /**
     * 获取当前用户信息
     * @returns 用户信息
     */
    getUser(): UserInfo | null {
        return this.user;
    }

    /**
     * 获取当前用户ID
     * @returns 用户ID
     */
    getUserId(): string | null {
        return this.user?.id || null;
    }

    /**
     * 获取当前用户名
     * @returns 用户名
     */
    getUsername(): string | null {
        return this.user?.username || null;
    }

    /**
     * 获取当前用户所属组织ID
     * @returns 组织ID
     */
    getOrgId(): string | null {
        return this.user?.orgId || null;
    }

    /**
     * 获取当前用户所属组织编码
     * @returns 组织编码
     */
    getOrgCode(): string | null {
        return this.user?.orgCode || null;
    }

    /**
     * 获取当前用户角色列表
     * @returns 角色列表
     */
    getRoles(): string[] {
        return this.user?.roles || [];
    }

    /**
     * 获取当前用户权限列表
     * @returns 权限列表
     */
    getPermissions(): string[] {
        return this.user?.permissions || [];
    }

    /**
     * 检查当前用户是否具有指定角色
     * @param role 角色
     * @returns 是否具有指定角色
     */
    hasRole(role: string): boolean {
        return this.user?.roles?.includes(role) || false;
    }

    /**
     * 检查当前用户是否具有指定权限
     * @param permission 权限
     * @returns 是否具有指定权限
     */
    hasPermission(permission: string): boolean {
        return this.user?.permissions?.includes(permission) || false;
    }

    /**
     * 清除当前用户信息
     */
    clear(): void {
        this.user = null;
    }
} 