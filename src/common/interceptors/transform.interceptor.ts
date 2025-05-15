import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RaxBizException } from '../exceptions/rax-biz.exception';

export interface Response<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map(data => ({
                success: true,
                message: '',
                data
            })),
            catchError(error => {
                // 处理其他类型的异常
                let message = '';
                if (error instanceof RaxBizException) {
                    message = error.message;
                } else if (error instanceof HttpException) {
                    message = error.message;
                } else if (error instanceof Error) {
                    message = error.message;
                }
                // 统一返回 200 状态码，通过 success 字段标识请求是否成功
                throw new HttpException({
                    success: false,
                    message,
                    data: null
                }, 200);
            })
        );
    }
} 