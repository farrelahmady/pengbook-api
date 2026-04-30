import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class GetJournalScrollListRequestDto {
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  cursor?: string;
}

export class JournalLineDto {
  @IsNumber()
  accountId: bigint;

  @IsNumber()
  @Min(0)
  debit: number;

  @IsNumber()
  @Min(0)
  credit: number;
}

export class CreateJournalDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalLineDto)
  lines: JournalLineDto[];
}

export interface RawJournalRow {
  journalDate: Date;
  description?: string;
  accountCode: string;
  debit: number;
  credit: number;
}
