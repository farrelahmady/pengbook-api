import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { CoaModule } from './modules/coa/coa.module';
import { LoggerModule } from './core/logging/logger.module';
import { JournalModule } from './modules/journal/journal.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [DatabaseModule, CoaModule, LoggerModule, JournalModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
