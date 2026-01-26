// src/modules/coa/coa.controller.ts
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CoaService } from './coa.service';
import { CreateCoaDto } from './dto/create-coa.dto';
import { AccountQueryDto } from './dto/coa-query.dto';

@Controller('coa')
export class CoaController {
  constructor(private readonly service: CoaService) {}

  @Post()
  create(@Body() dto: CreateCoaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: AccountQueryDto) {
    return this.service.findAll(query);
  }

  @Get('tree')
  findTree() {
    return this.service.findTree();
  }
}
