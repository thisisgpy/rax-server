import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SysAttachment } from '../../entities/sysAttachment.entity';
import { BatchCreateAttachmentDto } from './dto/batch-create-attachment.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { SNOWFLAKE } from '../../common/providers';
import { Snowflake } from '../../common/utils/snowflake';
import { UserContext } from '../../common/context/user-context';
import { LoggerService } from '../../common/logger/logger.service';
import * as path from 'path';
import * as fs from 'fs';
import * as mimeTypes from 'mime-types';

@Injectable()
export class AttachmentService {
    private readonly CONTEXT = 'AttachmentService';

    constructor(
        @InjectRepository(SysAttachment)
        private readonly attachmentRepository: Repository<SysAttachment>,
        @Inject(SNOWFLAKE)
        private readonly snowflake: Snowflake,
        @Inject('UserContext')
        private readonly userContext: UserContext,
        private readonly logger: LoggerService,
        private readonly configService: ConfigService
    ) {}

    /**
     * 批量新增附件
     * @param batchCreateDto 批量创建附件的数据
     * @returns 创建的附件列表
     * @throws {RaxBizException} 业务异常
     */
    async batchCreate(batchCreateDto: BatchCreateAttachmentDto): Promise<SysAttachment[]> {
        this.logger.info(this.CONTEXT, `批量新增附件开始: 数量=${batchCreateDto.attachments.length}`);
        
        if (!batchCreateDto.attachments || batchCreateDto.attachments.length === 0) {
            throw new RaxBizException('附件列表不能为空');
        }

        try {
            const attachments = batchCreateDto.attachments.map(dto => {
                return this.attachmentRepository.create({
                    id: this.snowflake.nextId(),
                    ...dto,
                    isDeleted: false,
                    createBy: this.userContext.getUsername()!,
                    createTime: new Date(),
                });
            });

            const savedAttachments = await this.attachmentRepository.save(attachments);
            this.logger.info(this.CONTEXT, `批量新增附件成功: 数量=${savedAttachments.length}`);
            return savedAttachments;
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `批量新增附件失败: 数量=${batchCreateDto.attachments.length}`);
            throw error;
        }
    }

    /**
     * 根据业务模块名称和业务数据ID获取所有附件详情
     * @param bizModule 业务模块名称
     * @param bizId 业务数据ID
     * @returns 附件列表
     */
    async findByBizModuleAndId(bizModule: string, bizId: number): Promise<SysAttachment[]> {
        this.logger.info(this.CONTEXT, `根据业务模块和ID查询附件: bizModule=${bizModule}, bizId=${bizId}`);
        
        try {
            const attachments = await this.attachmentRepository.find({
                where: {
                    bizModule,
                    bizId,
                    isDeleted: false
                },
                order: {
                    createTime: 'DESC'
                }
            });

            this.logger.info(this.CONTEXT, `查询附件成功: bizModule=${bizModule}, bizId=${bizId}, 数量=${attachments.length}`);
            return attachments;
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `查询附件失败: bizModule=${bizModule}, bizId=${bizId}`);
            throw error;
        }
    }

    /**
     * 根据业务模块名称获取所有附件详情
     * @param bizModule 业务模块名称
     * @returns 附件列表
     */
    async findByBizModule(bizModule: string): Promise<SysAttachment[]> {
        this.logger.info(this.CONTEXT, `根据业务模块查询附件: bizModule=${bizModule}`);
        
        try {
            const attachments = await this.attachmentRepository.find({
                where: {
                    bizModule,
                    isDeleted: false
                },
                order: {
                    createTime: 'DESC'
                }
            });

            this.logger.info(this.CONTEXT, `查询附件成功: bizModule=${bizModule}, 数量=${attachments.length}`);
            return attachments;
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `查询附件失败: bizModule=${bizModule}`);
            throw error;
        }
    }

    /**
     * 根据附件ID获取附件详情
     * @param id 附件ID
     * @returns 附件详情
     * @throws {RaxBizException} 业务异常
     */
    async findById(id: number): Promise<SysAttachment> {
        this.logger.info(this.CONTEXT, `查询附件详情: ID=${id}`);
        
        const attachment = await this.attachmentRepository.findOne({
            where: { id, isDeleted: false }
        });

        if (!attachment) {
            throw new RaxBizException(`附件不存在: ${id}`);
        }

        this.logger.info(this.CONTEXT, `查询附件详情成功: ID=${id}`);
        return attachment;
    }

    /**
     * 删除附件（软删除）
     * @param id 附件ID
     * @returns 删除是否成功
     * @throws {RaxBizException} 业务异常
     */
    async delete(id: number): Promise<boolean> {
        this.logger.info(this.CONTEXT, `软删除附件开始: ID=${id}`);
        
        const attachment = await this.attachmentRepository.findOne({
            where: { id, isDeleted: false }
        });

        if (!attachment) {
            throw new RaxBizException(`附件不存在: ${id}`);
        }

        try {
            // 软删除：只更新is_deleted字段
            await this.attachmentRepository.update(id, { 
                isDeleted: true 
            });
            this.logger.info(this.CONTEXT, `软删除附件成功: ID=${id}`);
            return true;
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `软删除附件失败: ID=${id}`);
            throw error;
        }
    }

    /**
     * 批量更新附件的业务信息
     * @param attachmentIds 附件ID数组
     * @param bizModule 业务模块名称
     * @param bizId 业务数据ID
     * @returns 更新是否成功
     * @throws {RaxBizException} 业务异常
     */
    async updateAttachmentsBizInfo(attachmentIds: number[], bizModule: string, bizId: number): Promise<boolean> {
        this.logger.info(this.CONTEXT, `批量更新附件业务信息开始: attachmentIds=${attachmentIds.join(',')}, bizModule=${bizModule}, bizId=${bizId}`);
        
        if (!attachmentIds || attachmentIds.length === 0) {
            throw new RaxBizException('附件ID列表不能为空');
        }

        try {
            // 检查附件是否存在且未删除
            const existingAttachments = await this.attachmentRepository.find({
                where: {
                    id: In(attachmentIds),
                    isDeleted: false
                }
            });

            if (existingAttachments.length !== attachmentIds.length) {
                const existingIds = existingAttachments.map(att => att.id);
                const missingIds = attachmentIds.filter(id => !existingIds.includes(id));
                throw new RaxBizException(`以下附件不存在或已删除: ${missingIds.join(',')}`);
            }

            // 批量更新业务信息
            const result = await this.attachmentRepository.update(
                {
                    id: In(attachmentIds),
                    isDeleted: false
                },
                {
                    bizModule,
                    bizId
                }
            );

            this.logger.info(this.CONTEXT, `批量更新附件业务信息成功: 更新数量=${result.affected}`);
            return true;
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `批量更新附件业务信息失败: attachmentIds=${attachmentIds.join(',')}`);
            throw error;
        }
    }

    /**
     * 批量删除附件（软删除）
     * @param bizModule 业务模块名称
     * @param bizId 业务数据ID
     * @returns 删除是否成功
     */
    async deleteBatch(bizModule: string, bizId: number): Promise<boolean> {
        this.logger.info(this.CONTEXT, `批量软删除附件开始: bizModule=${bizModule}, bizId=${bizId}`);
        
        try {
            // 软删除：只更新is_deleted字段
            const result = await this.attachmentRepository.update(
                {
                    bizModule,
                    bizId,
                    isDeleted: false
                },
                {
                    isDeleted: true
                }
            );

            this.logger.info(this.CONTEXT, `批量软删除附件成功: bizModule=${bizModule}, bizId=${bizId}, 删除数量=${result.affected}`);
            return true;
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `批量软删除附件失败: bizModule=${bizModule}, bizId=${bizId}`);
            throw error;
        }
    }

    /**
     * 预上传文件处理（不绑定业务数据）
     * @param file 上传的文件（文件名已通过 Pipe 处理过编码问题）
     * @returns 保存的附件信息
     * @throws {RaxBizException} 业务异常
     */
    async preUploadFile(file: Express.Multer.File): Promise<SysAttachment> {
        this.logger.info(this.CONTEXT, `文件预上传开始: originalName=${file.originalname}`);
        
        // 验证文件（文件名已通过 FileNameEncodePipe 处理过）
        this.validateFile(file);
        
        // 生成文件保存路径和文件名（使用临时的业务模块名）
        const { filePath, savedName } = this.generatePreUploadFilePath(file.originalname);
        
        try {
            // 确保目录存在
            this.ensureDirectoryExists(path.dirname(filePath));
            
            // 保存文件
            fs.writeFileSync(filePath, file.buffer);
            
            // 获取文件扩展名
            const extension = path.extname(file.originalname).slice(1);
            
            // 保存附件信息到数据库（bizModule 和 bizId 为空）
            const attachment = new SysAttachment();
            attachment.id = this.snowflake.nextId();
            attachment.bizModule = null;
            attachment.bizId = null;
            attachment.originalName = file.originalname;
            attachment.savedName = savedName;
            attachment.extension = extension;
            attachment.fileSize = file.size;
            attachment.isDeleted = false;
            attachment.createBy = this.userContext.getUsername()!;
            attachment.createTime = new Date();

            const savedAttachment = await this.attachmentRepository.save(attachment);
            this.logger.info(this.CONTEXT, `文件预上传成功: ID=${savedAttachment.id}, filePath=${filePath}`);
            return savedAttachment;
        } catch (error) {
            // 如果数据库保存失败，删除已保存的文件
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            this.logger.error(this.CONTEXT, error, `文件预上传失败: originalName=${file.originalname}`);
            throw error;
        }
    }

    /**
     * 文件上传处理
     * @param uploadDto 上传参数
     * @param file 上传的文件（文件名已通过 Pipe 处理过编码问题）
     * @returns 保存的附件信息
     * @throws {RaxBizException} 业务异常
     */
    async uploadFile(uploadDto: UploadFileDto, file: Express.Multer.File): Promise<SysAttachment> {
        this.logger.info(this.CONTEXT, `文件上传开始: bizModule=${uploadDto.bizModule}, bizId=${uploadDto.bizId}, originalName=${file.originalname}`);
        
        // 验证文件（文件名已通过 FileNameEncodePipe 处理过）
        this.validateFile(file);
        
        // 生成文件保存路径和文件名
        const { filePath, savedName } = this.generateFilePath(uploadDto.bizModule, uploadDto.bizId, file.originalname);
        
        try {
            // 确保目录存在
            this.ensureDirectoryExists(path.dirname(filePath));
            
            // 保存文件
            fs.writeFileSync(filePath, file.buffer);
            
            // 获取文件扩展名
            const extension = path.extname(file.originalname).slice(1);
            
            // 保存附件信息到数据库
            const attachment = this.attachmentRepository.create({
                id: this.snowflake.nextId(),
                bizModule: uploadDto.bizModule,
                bizId: uploadDto.bizId,
                originalName: file.originalname,
                savedName: savedName,
                extension: extension,
                fileSize: file.size,
                isDeleted: false,
                createBy: this.userContext.getUsername()!,
                createTime: new Date(),
            });

            const savedAttachment = await this.attachmentRepository.save(attachment);
            this.logger.info(this.CONTEXT, `文件上传成功: ID=${savedAttachment.id}, filePath=${filePath}`);
            return savedAttachment;
        } catch (error) {
            // 如果数据库保存失败，删除已保存的文件
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            this.logger.error(this.CONTEXT, error, `文件上传失败: bizModule=${uploadDto.bizModule}, bizId=${uploadDto.bizId}`);
            throw error;
        }
    }

    /**
     * 验证文件
     * @param file 上传的文件
     * @throws {RaxBizException} 验证失败异常
     */
    private validateFile(file: Express.Multer.File): void {
        // 获取配置
        const maxSizeMB = this.configService.get<number>('MAX_FILE_SIZE_MB', 1024);
        const acceptTypes = this.configService.get<string>('ACCEPT_FILE_TYPES', 'jpg,jpeg,png,xlsx,xls,doc,docx,pdf,txt');
        
        // 检查文件大小
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            throw new RaxBizException(`文件大小超出限制，最大允许${maxSizeMB}MB`);
        }
        
        // 检查文件类型
        const allowedTypes = acceptTypes.toLowerCase().split(',').map(type => type.trim());
        const fileExtension = path.extname(file.originalname).slice(1).toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            throw new RaxBizException(`不支持的文件类型，仅支持: ${acceptTypes}`);
        }
        
        // 通过MIME类型二次验证
        const expectedMimeType = mimeTypes.lookup(fileExtension);
        if (expectedMimeType && file.mimetype !== expectedMimeType) {
            throw new RaxBizException('文件类型与扩展名不匹配');
        }
    }

    /**
     * 生成文件保存路径
     * @param bizModule 业务模块
     * @param bizId 业务ID
     * @param originalName 原文件名
     * @returns 文件路径和保存名称
     */
    private generateFilePath(bizModule: string, bizId: number, originalName: string): { filePath: string, savedName: string } {
        const uploadDir = this.configService.get<string>('DEFAULT_FILE_DIR', 'uploads');
        
        // 获取本地时间（UTC+8）格式化为 yyyyMMddHHmmssSSS
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
        
        const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
        const extension = path.extname(originalName);
        const savedName = `${bizModule}-${bizId}-${timestamp}${extension}`;
        const filePath = path.join(process.cwd(), uploadDir, savedName);
        
        return { filePath, savedName };
    }

    /**
     * 生成预上传文件保存路径
     * @param originalName 原文件名
     * @returns 文件路径和保存名称
     */
    private generatePreUploadFilePath(originalName: string): { filePath: string, savedName: string } {
        const uploadDir = this.configService.get<string>('DEFAULT_FILE_DIR', 'uploads');
        
        // 获取本地时间（UTC+8）格式化为 yyyyMMddHHmmssSSS
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
        
        const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
        const extension = path.extname(originalName);
        const savedName = `PRE-UPLOAD-${timestamp}${extension}`;
        const filePath = path.join(process.cwd(), uploadDir, savedName);
        
        return { filePath, savedName };
    }

    /**
     * 下载附件文件
     * @param id 附件ID
     * @returns 文件信息和文件流
     * @throws {RaxBizException} 业务异常
     */
    async downloadFile(id: number): Promise<{ attachment: SysAttachment, fileBuffer: Buffer }> {
        this.logger.info(this.CONTEXT, `下载附件开始: ID=${id}`);
        
        // 获取附件信息
        const attachment = await this.findById(id);
        
        // 构建文件路径
        const uploadDir = this.configService.get<string>('DEFAULT_FILE_DIR', 'uploads');
        const filePath = path.join(process.cwd(), uploadDir, attachment.savedName);
        
        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
            this.logger.error(this.CONTEXT, new Error(`文件不存在: ${filePath}`), `文件不存在: ${filePath}`);
            throw new RaxBizException('文件不存在或已被删除');
        }
        
        try {
            // 读取文件内容
            const fileBuffer = fs.readFileSync(filePath);
            this.logger.info(this.CONTEXT, `下载附件成功: ID=${id}, filePath=${filePath}`);
            
            return { attachment, fileBuffer };
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `读取文件失败: ${filePath}`);
            throw new RaxBizException('文件读取失败');
        }
    }

    /**
     * 删除附件及其文件（物理删除和软删除）
     * @param id 附件ID
     * @returns 删除是否成功
     * @throws {RaxBizException} 业务异常
     */
    async deleteWithFile(id: number): Promise<boolean> {
        this.logger.info(this.CONTEXT, `删除附件及文件开始: ID=${id}`);
        
        const attachment = await this.attachmentRepository.findOne({
            where: { id, isDeleted: false }
        });

        if (!attachment) {
            throw new RaxBizException(`附件不存在: ${id}`);
        }

        try {
            // 删除物理文件
            const uploadDir = this.configService.get<string>('DEFAULT_FILE_DIR', 'uploads');
            const filePath = path.join(process.cwd(), uploadDir, attachment.savedName);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                this.logger.info(this.CONTEXT, `删除物理文件成功: ${filePath}`);
            } else {
                this.logger.warn(this.CONTEXT, `物理文件不存在: ${filePath}`);
            }
            
            // 软删除数据库记录
            await this.attachmentRepository.update(id, { 
                isDeleted: true 
            });
            this.logger.info(this.CONTEXT, `删除附件及文件成功: ID=${id}`);
            return true;
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `删除附件及文件失败: ID=${id}`);
            throw error;
        }
    }

    /**
     * 确保目录存在
     * @param dirPath 目录路径
     */
    private ensureDirectoryExists(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    /**
     * 解码文件名，修复中文乱码问题
     * @param filename 原始文件名
     * @returns 解码后的文件名
     */
    private decodeFilename(filename: string): string {
        try {
            // 尝试解码可能被编码的文件名
            // 先尝试 decodeURI，如果失败则使用 Buffer 转换
            try {
                const decoded = decodeURIComponent(filename);
                // 如果解码后的文件名与原文件名不同，说明原文件名是编码过的
                if (decoded !== filename) {
                    return decoded;
                }
            } catch (error) {
                // decodeURIComponent 失败，尝试 Buffer 转换
            }

            // 尝试处理 ISO-8859-1 到 UTF-8 的转换（常见的中文乱码情况）
            if (this.hasGarbledChars(filename)) {
                const buffer = Buffer.from(filename, 'latin1');
                const utf8String = buffer.toString('utf8');
                
                // 验证转换后的字符串是否有效
                if (this.isValidUtf8(utf8String)) {
                    return utf8String;
                }
            }

            // 如果所有转换都失败，返回原文件名
            return filename;
        } catch (error) {
            this.logger.warn(this.CONTEXT, `文件名解码失败: ${filename}, 使用原文件名`);
            return filename;
        }
    }

    /**
     * 检查字符串是否包含乱码字符
     * @param str 待检查的字符串
     * @returns 是否包含乱码字符
     */
    private hasGarbledChars(str: string): boolean {
        // 检查是否包含常见的乱码字符模式
        const garbledPattern = /[\u00C0-\u00FF]{2,}/;
        return garbledPattern.test(str);
    }

    /**
     * 验证字符串是否为有效的UTF-8编码
     * @param str 待验证的字符串
     * @returns 是否为有效的UTF-8
     */
    private isValidUtf8(str: string): boolean {
        try {
            // 尝试将字符串转换为Buffer再重新解码，如果成功且相等，说明是有效的UTF-8
            const buffer = Buffer.from(str, 'utf8');
            const decoded = buffer.toString('utf8');
            return decoded === str;
        } catch (error) {
            return false;
        }
    }
} 