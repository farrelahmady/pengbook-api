import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';

class JournalLineDto {
  @IsUUID()
  accountId: string;

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
