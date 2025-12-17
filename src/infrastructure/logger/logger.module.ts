import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { pinoConfig } from './pino.config';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: pinoConfig(),
    }),
  ],
})
export class AppLoggerModule {}
