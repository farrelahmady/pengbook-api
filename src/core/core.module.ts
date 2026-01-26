// src/core/core.module.ts
import { Global, Module } from '@nestjs/common';
import { RequestContextProvider } from './context/request-context.provider';

@Global()
@Module({
  providers: [RequestContextProvider],
  exports: [RequestContextProvider],
})
export class CoreModule {}
