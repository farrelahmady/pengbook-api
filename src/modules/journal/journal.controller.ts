import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JournalService } from './journal.service';
import { CreateJournalDto } from './dto/create-journal.dto';

@Controller('journals')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  create(@Body() dto: CreateJournalDto) {
    return this.journalService.create(dto);
  }

  @Get()
  findAll() {
    return this.journalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journalService.findById(id);
  }
}
