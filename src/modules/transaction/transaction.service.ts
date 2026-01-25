import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { JournalService } from '../journal/journal.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly journalService: JournalService) {}

  async create(dto: CreateTransactionDto) {
    if (dto.fromAccountId === dto.toAccountId) {
      throw new HttpException('From and To account cannot be the same', 400);
    }

    if (dto.amount <= 0) {
      throw new HttpException('Amount must be greater than zero', 400);
    }

    return this.journalService.create({
      date: dto.date,
      description: dto.notes,
      lines: [
        {
          accountId: dto.fromAccountId,
          debit: 0,
          credit: dto.amount,
        },
        {
          accountId: dto.toAccountId,
          debit: dto.amount,
          credit: 0,
        },
      ],
    });
  }
}
