import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

// core/database/database.module.ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
