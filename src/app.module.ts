import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { CoaModule } from './modules/coa/coa.module';
import { LoggerModule } from './core/logging/logger.module';
import { JournalModule } from './modules/journal/journal.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, DatabaseModule, CoaModule, LoggerModule, JournalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
