import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserContext } from '../context/user-context';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        @Inject('UserContext')
        private readonly userContext: UserContext
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        this.userContext.setUserId('1');
        this.userContext.setUsername('admin');
        // 从请求头中获取 token
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            // TODO: 验证 token 并设置用户信息
            // 这里暂时模拟设置用户信息
            this.userContext.setUserId('1');
            this.userContext.setUsername('admin');
        }
        next();
    }
} 