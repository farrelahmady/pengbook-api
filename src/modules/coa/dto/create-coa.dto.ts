import { AccountType } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCoaDto {
  @IsString()
  @Length(2, 20)
  code: string;

  @IsString()
  name: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsOptional()
  @IsNumber()
  parentId?: bigint;
}
