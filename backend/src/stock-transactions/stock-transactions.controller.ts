import { Controller, Get, Post, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { StockTransactionsService } from './stock-transactions.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('stock-transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockTransactionsController {
  constructor(private readonly stockTransactionsService: StockTransactionsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'INVENTORY_MANAGER', 'STOREKEEPER')
  create(
    @Request() req,
    @Body() createDto: Prisma.StockTransactionUncheckedCreateInput,
  ) {
    const userId = req.user?.userId ?? req.user?.sub;
    return this.stockTransactionsService.create({
      ...createDto,
      userId,
    });
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('stockItemId') stockItemId?: string,
  ) {
    return this.stockTransactionsService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      where: stockItemId ? { stockItemId } : {},
      orderBy: { date: 'desc' },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockTransactionsService.findOne(id);
  }
}
