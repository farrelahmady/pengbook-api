import { Transform, Type } from 'class-transformer';
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
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
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
