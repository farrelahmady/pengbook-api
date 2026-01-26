import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { AccountType } from '@prisma/client';

export class AccountQueryDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  posting?: boolean;

  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @IsOptional()
  parentId?: string;
}
