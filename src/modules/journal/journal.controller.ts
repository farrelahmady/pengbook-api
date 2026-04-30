import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { JournalService } from './journal.service';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  GetJournalScrollListRequestDto,
  CreateJournalDto,
} from './journal.dto';

@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  create(@Body() dto: CreateJournalDto) {
    return this.journalService.create(dto);
  }

  @Get()
  findAll(@Query() query: GetJournalScrollListRequestDto) {
    return this.journalService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: bigint) {
    return this.journalService.findById(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importJournal(@UploadedFile() file: Express.Multer.File) {
    return this.journalService.importFromExcel(file.buffer);
  }

  @Get('import/template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.journalService.generateImportTemplate();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=journal-import-template.xlsx',
    );

    res.end(buffer);
  }
}
