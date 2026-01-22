// src/modules/coa/coa.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCoaDto } from './dto/create-coa.dto';
import { PrismaService } from '@/core/database/prisma/prisma.service';

@Injectable()
export class CoaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCoaDto) {
    const exists = await this.prisma.chartOfAccount.findUnique({
      where: { code: dto.code },
    });

    if (exists) {
      throw new BadRequestException('Account code already exists');
    }

    if (dto.parentId) {
      const parent = await this.prisma.chartOfAccount.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new BadRequestException('Parent account not found');
      }

      // HARD RULE: parent & child type harus sama
      if (parent.type !== dto.type) {
        throw new BadRequestException(
          'Parent and child account type must be the same',
        );
      }
    }

    return this.prisma.chartOfAccount.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.chartOfAccount.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async findTree() {
    return this.prisma.chartOfAccount.findMany({
      where: { parentId: null },
      include: { children: true },
      orderBy: { code: 'asc' },
    });
  }
}
