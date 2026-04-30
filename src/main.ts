import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './core/exceptions/http-exception.filter';
import { LoggerService } from './core/logging/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { Prisma } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // penting
  });

  (BigInt.prototype as any).toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  (Prisma.Decimal.prototype as any).toJSON = function () {
    const float = Number.parseFloat(this.toString());
    return float ?? this.toString();
  };

  const logger = app.get(LoggerService);
  app.useLogger(logger);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
