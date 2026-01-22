import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { CoaModule } from './modules/coa/coa.module';

@Module({
  imports: [DatabaseModule, CoaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
