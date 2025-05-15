import { HttpException, HttpStatus } from '@nestjs/common';

export class RaxBizException extends HttpException {
    constructor(message: string) {
        super(
            {
                success: false,
                message,
                data: null
            },
            HttpStatus.OK
        );
    }
} 