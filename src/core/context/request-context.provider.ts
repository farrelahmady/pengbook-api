// core/context/request-context.provider.ts
import { Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RequestContext } from './request-context';

export const RequestContextProvider = {
  provide: RequestContext,
  scope: Scope.REQUEST,
  inject: [REQUEST],
  useFactory: (req: Request): RequestContext => {
    return {
      timezone:
        (req.headers['x-timezone'] as string) ?? process.env.APP_TIMEZONE,
    };
  },
};
