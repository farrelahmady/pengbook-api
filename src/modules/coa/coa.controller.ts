// src/modules/coa/coa.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CoaService } from './coa.service';
import { CreateCoaDto } from './dto/create-coa.dto';

@Controller('coa')
export class CoaController {
  constructor(private readonly service: CoaService) {}

  @Post()
  create(@Body() dto: CreateCoaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('tree')
  findTree() {
    return this.service.findTree();
  }
}
