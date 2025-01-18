const config = {
    // Server Configuration
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Database Configuration
    database: {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        poolConfig: {
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000
        }
    },

    // CORS Configuration
    cors: {
        origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [],
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    },

    // File Upload Configuration
    upload: {
        maxFileSize: 100 * 1024 * 1024, // 100MB
        path: './uploads',
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'],
        maxFiles: 5
    },

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        algorithm: 'HS256'
    },

    // Admin Configuration
    admin: {
        defaultUsername: process.env.ADMIN_USERNAME,
        defaultPassword: process.env.ADMIN_PASSWORD,
        passwordMinLength: 8,
        passwordMaxLength: 100
    },

    // Validation Rules
    validation: {
        post: {
            titleMinLength: 3,
            titleMaxLength: 200,
            contentMinLength: 50,
            contentMaxLength: 10000
        },
        comment: {
            contentMinLength: 2,
            contentMaxLength: 1000,
            authorNameMinLength: 2,
            authorNameMaxLength: 50
        },
        category: {
            nameMinLength: 2,
            nameMaxLength: 50
        }
    },

    // Pagination Configuration
    pagination: {
        defaultLimit: 10,
        maxLimit: 100
    },

    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    },

    // Cache Configuration
    cache: {
        ttl: 60 * 60 * 1000, // 1 hour
        checkPeriod: 120 * 60 * 1000 // 2 hours
    },

    // Media Configuration
    media: {
        imageMaxSize: 5 * 1024 * 1024, // 5MB
        videoMaxSize: 50 * 1024 * 1024, // 50MB
        imageSizes: {
            thumbnail: { width: 150, height: 150 },
            medium: { width: 300, height: 300 },
            large: { width: 800, height: 800 }
        }
    }
};

// Production overrides
if (process.env.NODE_ENV === 'production') {
    config.cors.origin = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];
}

module.exports = config;
