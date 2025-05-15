import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
    // 这里可以从环境变量或配置文件中读取配置
    // 为了安全起见，建议使用环境变量
    const config = {
        type: 'mysql' as const,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'database',
        entities: [],
        synchronize: false,
        timezone: '+08:00',
        // 配置日期格式
        dateStrings: true,
        extra: {
            charset: 'utf8mb4',
            // 配置日期时间格式
            dateStrings: {
                DATE: 'YYYY-MM-DD',
                DATETIME: 'YYYY-MM-DD HH:mm:ss'
            }
        }
    };

    // 在生产环境中，我们应该禁用 synchronize
    if (process.env.NODE_ENV === 'production') {
        config.synchronize = false;
    }

    return config;
}); 