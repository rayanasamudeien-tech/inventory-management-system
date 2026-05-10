import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'INVENTORY_MANAGER', 'STOREKEEPER')
  create(@Body() createStockDto: Prisma.StockItemUncheckedCreateInput) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    const where: Prisma.StockItemWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { itemId: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return this.stockService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      where,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'INVENTORY_MANAGER', 'STOREKEEPER')
  update(@Param('id') id: string, @Body() updateStockDto: Prisma.StockItemUpdateInput) {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN')
  remove(@Param('id') id: string) {
    return this.stockService.remove(id);
  }
}
