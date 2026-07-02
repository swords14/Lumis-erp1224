import { Module, Global } from '@nestjs/common';

/** Módulo de configuração global (placeholder para ConfigService) */
@Global()
@Module({
  providers: [
    {
      provide: 'APP_CONFIG',
      useValue: {
        appName: 'Ferramenta ERP',
        version: '1.0.0',
        port: process.env.PORT || 3000,
        databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ferramenta',
        jwtSecret: process.env.JWT_SECRET || 'ferramenta-secret-key-change-in-production',
        jwtExpiration: process.env.JWT_EXPIRATION || '15m',
        refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
      },
    },
  ],
  exports: ['APP_CONFIG'],
})
export class ConfigModule {}