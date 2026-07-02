// ──── Entrypoint do Backend NestJS ────

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // ──── Segurança ────
  app.use(helmet.default());
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:1420', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Id'],
  });

  // ──── Performance ────
  app.use(compression());
  app.use(cookieParser.default());

  // ──── Prefixo Global da API ────
  app.setGlobalPrefix('api/v1');

  // ──── Validação Global ────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ──── Porta ────
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Servidor iniciado em http://0.0.0.0:${port}`);
  logger.log(`📡 API disponível em http://0.0.0.0:${port}/api/v1`);
  logger.log(`🔌 WebSocket disponível em ws://0.0.0.0:${port}`);
}

bootstrap();