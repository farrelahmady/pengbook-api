import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { CoaModule } from './modules/coa/coa.module';
import { LoggerModule } from './core/logging/logger.module';

@Module({
  imports: [DatabaseModule, CoaModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
