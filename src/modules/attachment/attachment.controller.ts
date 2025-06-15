import { 
    Controller, 
    Post, 
    Body, 
    UploadedFile, 
    UseInterceptors,
    Get,
    Delete,
    Param,
    Query,
    Res,
    Put
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { AttachmentService } from './attachment.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { SysAttachment } from '../../entities/sysAttachment.entity';
import { ApiRaxResponse } from '../../common/decorators/api-response.decorator';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { FileNameEncodePipe } from './pipes/filename-encode.pipe';
import * as mimeTypes from 'mime-types';

@ApiTags('附件管理')
@Controller('api/v1/attachment')
export class AttachmentController {
    constructor(private readonly attachmentService: AttachmentService) {}

    @ApiOperation({
        summary: '预上传文件',
        description: '预先上传文件，不绑定业务数据，返回附件ID用于后续关联'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: '文件预上传',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: '上传的文件'
                }
            },
            required: ['file']
        }
    })
    @ApiRaxResponse({
        description: '预上传成功'
    })
    @Post('pre-upload')
    @UseInterceptors(FileInterceptor('file'))
    async preUploadFile(
        @UploadedFile(FileNameEncodePipe) file: Express.Multer.File
    ): Promise<{ id: number; originalName: string; fileSize: number }> {
        if (!file) {
            throw new RaxBizException('请选择要上传的文件');
        }

        const attachment = await this.attachmentService.preUploadFile(file);
        return {
            id: attachment.id,
            originalName: attachment.originalName,
            fileSize: attachment.fileSize
        };
    }

    @ApiOperation({
        summary: '上传文件',
        description: '上传单个文件并保存附件信息到数据库'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: '文件上传',
        schema: {
            type: 'object',
            properties: {
                bizModule: {
                    type: 'string',
                    description: '业务模块名称',
                    example: 'asset_fixed'
                },
                bizId: {
                    type: 'number',
                    description: '业务数据ID',
                    example: 123
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: '上传的文件'
                }
            },
            required: ['bizModule', 'bizId', 'file']
        }
    })
    @ApiRaxResponse({
        description: '上传成功',
        type: SysAttachment
    })
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Body() uploadDto: UploadFileDto,
        @UploadedFile(FileNameEncodePipe) file: Express.Multer.File
    ): Promise<SysAttachment> {
        if (!file) {
            throw new RaxBizException('请选择要上传的文件');
        }

        return await this.attachmentService.uploadFile(uploadDto, file);
    }

    @ApiOperation({
        summary: '批量更新附件业务信息',
        description: '将预上传的附件关联到具体的业务数据'
    })
    @ApiBody({
        description: '批量更新附件业务信息',
        schema: {
            type: 'object',
            properties: {
                attachmentIds: {
                    type: 'array',
                    items: { type: 'number' },
                    description: '附件ID数组',
                    example: [123456789, 123456790]
                },
                bizModule: {
                    type: 'string',
                    description: '业务模块名称',
                    example: 'asset_fixed'
                },
                bizId: {
                    type: 'number',
                    description: '业务数据ID',
                    example: 123
                }
            },
            required: ['attachmentIds', 'bizModule', 'bizId']
        }
    })
    @ApiRaxResponse({
        description: '更新成功'
    })
    @Put('batch-update-biz-info')
    async updateAttachmentsBizInfo(
        @Body() updateDto: { attachmentIds: number[]; bizModule: string; bizId: number }
    ): Promise<{ success: boolean }> {
        const { attachmentIds, bizModule, bizId } = updateDto;
        
        if (!attachmentIds || attachmentIds.length === 0) {
            throw new RaxBizException('附件ID列表不能为空');
        }
        
        if (!bizModule || !bizId) {
            throw new RaxBizException('业务模块名称和业务ID不能为空');
        }
        
        const result = await this.attachmentService.updateAttachmentsBizInfo(attachmentIds, bizModule, bizId);
        return { success: result };
    }

    @ApiOperation({
        summary: '删除附件',
        description: '根据附件ID软删除附件记录（保留物理文件）'
    })
    @ApiParam({
        name: 'id',
        description: '附件ID',
        type: 'number',
        example: 123
    })
    @ApiRaxResponse({
        description: '删除成功'
    })
    @Delete(':id')
    async deleteAttachment(@Param('id') id: number): Promise<{ success: boolean }> {
        const result = await this.attachmentService.delete(id);
        return { success: result };
    }

    @ApiOperation({
        summary: '获取附件列表',
        description: '根据业务模块和业务ID获取所有相关附件'
    })
    @ApiQuery({
        name: 'bizModule',
        description: '业务模块名称',
        type: 'string',
        example: 'asset_fixed'
    })
    @ApiQuery({
        name: 'bizId',
        description: '业务数据ID',
        type: 'number',
        example: 123
    })
    @ApiRaxResponse({
        description: '获取成功',
        type: SysAttachment,
        isArray: true
    })
    @Get('list')
    async getAttachmentList(
        @Query('bizModule') bizModule: string,
        @Query('bizId') bizId: number
    ): Promise<SysAttachment[]> {
        if (!bizModule || !bizId) {
            throw new RaxBizException('业务模块名称和业务ID不能为空');
        }
        
        return await this.attachmentService.findByBizModuleAndId(bizModule, bizId);
    }

    @ApiOperation({
        summary: '下载附件',
        description: '根据附件ID下载文件，使用原始文件名（支持中文）'
    })
    @ApiParam({
        name: 'id',
        description: '附件ID',
        type: 'number',
        example: 123
    })
    @Get('download/:id')
    async downloadAttachment(
        @Param('id') id: number,
        @Res() res: Response
    ): Promise<void> {
        const { attachment, fileBuffer } = await this.attachmentService.downloadFile(id);
        
        // 处理中文文件名编码
        const encodedFilename = this.encodeChineseFilename(attachment.originalName);
        
        // 获取MIME类型
        const mimeType = mimeTypes.lookup(attachment.extension) || 'application/octet-stream';
        
        // 设置响应头
        res.set({
            'Content-Type': mimeType,
            'Content-Disposition': `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodeURIComponent(attachment.originalName)}`,
            'Content-Length': fileBuffer.length.toString(),
            'Cache-Control': 'no-cache'
        });
        
        // 发送文件内容
        res.send(fileBuffer);
    }

    /**
     * 编码中文文件名以兼容不同浏览器
     * @param filename 原始文件名
     * @returns 编码后的文件名
     */
    private encodeChineseFilename(filename: string): string {
        try {
            // 检查是否包含中文字符
            if (/[\u4e00-\u9fff]/.test(filename)) {
                // 对于包含中文的文件名，使用简单的ASCII替换作为fallback
                return filename.replace(/[\u4e00-\u9fff]/g, '?');
            }
            return filename;
        } catch (error) {
            return 'download.' + (filename.split('.').pop() || 'txt');
        }
    }
} 