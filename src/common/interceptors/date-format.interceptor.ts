import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DateFormatInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => this.formatDates(data))
        );
    }

    private formatDates(data: any): any {
        if (!data) return data;

        if (data instanceof Date) {
            return this.formatDate(data);
        }

        if (Array.isArray(data)) {
            return data.map(item => this.formatDates(item));
        }

        if (typeof data === 'object') {
            const formatted = {};
            for (const key in data) {
                if (data[key] instanceof Date) {
                    formatted[key] = this.formatDate(data[key]);
                } else if (typeof data[key] === 'object') {
                    formatted[key] = this.formatDates(data[key]);
                } else {
                    formatted[key] = data[key];
                }
            }
            return formatted;
        }

        return data;
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // 如果时间是 00:00:00，则只返回日期部分
        if (hours === '00' && minutes === '00' && seconds === '00') {
            return `${year}-${month}-${day}`;
        }

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
} 