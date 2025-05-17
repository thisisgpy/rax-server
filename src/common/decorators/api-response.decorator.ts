import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export interface ApiResponseOptions {
  type?: Type<any> | Function;
  isArray?: boolean;
  description?: string;
}

export const ApiRaxResponse = (options: ApiResponseOptions = {}) => {
  const { type, isArray = false, description } = options;

  // 定义基础响应结构
  class BaseResponse {
    success: boolean;
    message: string;
    data: any;
  }

  if (!type) {
    return applyDecorators(
      ApiOkResponse({
        description: description || 'Success',
        schema: {
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: '' },
            data: { type: 'object', nullable: true },
          },
        },
      }),
    );
  }

  return applyDecorators(
    ApiExtraModels(type),
    ApiOkResponse({
      description: description || 'Success',
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean', example: true },
              message: { type: 'string', example: '' },
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(type) },
                  }
                : { $ref: getSchemaPath(type) },
            },
          },
        ],
      },
    }),
  );
}; 