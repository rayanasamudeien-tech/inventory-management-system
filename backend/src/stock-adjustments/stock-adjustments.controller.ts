import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { StockAdjustmentsService } from './stock-adjustments.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('stock-adjustments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockAdjustmentsController {
  constructor(private readonly stockAdjustmentsService: StockAdjustmentsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'INVENTORY_MANAGER', 'STOREKEEPER')
  create(@Body() createStockAdjustmentDto: any, @Request() req: any) {
    const data = {
      stockItemId: createStockAdjustmentDto.stockItemId,
      userId: req.user.id,
      oldQuantity: createStockAdjustmentDto.oldQuantity,
      newQuantity: createStockAdjustmentDto.newQuantity,
      reason: createStockAdjustmentDto.reason,
    };
    return this.stockAdjustmentsService.create(data);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('stockItemId') stockItemId?: string,
  ) {
    const where: Prisma.StockAdjustmentWhereInput = stockItemId
      ? { stockItemId }
      : {};

    return this.stockAdjustmentsService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      where,
      orderBy: { date: 'desc' },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockAdjustmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'INVENTORY_MANAGER')
  update(@Param('id') id: string, @Body() updateStockAdjustmentDto: Prisma.StockAdjustmentUpdateInput) {
    return this.stockAdjustmentsService.update(id, updateStockAdjustmentDto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN')
  remove(@Param('id') id: string) {
    return this.stockAdjustmentsService.remove(id);
  }
}