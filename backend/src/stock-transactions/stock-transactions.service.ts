import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockTransaction, Prisma, StockTransactionType } from '@prisma/client';

@Injectable()
export class StockTransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.StockTransactionUncheckedCreateInput): Promise<StockTransaction> {
    const rawData = data as any;
    const stockItemId =
      typeof data.stockItemId === 'string'
        ? data.stockItemId
        : rawData.stockItem?.connect?.id;

    if (!stockItemId) {
      throw new BadRequestException('Stock item reference is required');
    }

    return this.prisma.$transaction(async (tx) => {
      const stockItem = await tx.stockItem.findUnique({
        where: { id: stockItemId },
      });

      if (!stockItem) {
        throw new BadRequestException('Stock item not found');
      }

      // Update stock quantity based on transaction type
      let newQuantity = stockItem.quantity;
      if (data.type === StockTransactionType.RECEIVE || data.type === StockTransactionType.RETURN) {
        newQuantity += data.quantity;
      } else if (data.type === StockTransactionType.ISSUE || data.type === StockTransactionType.ADJUST) {
        if (stockItem.quantity < data.quantity && data.type === StockTransactionType.ISSUE) {
          throw new BadRequestException('Insufficient stock');
        }
        newQuantity -= data.quantity;
      }

      await tx.stockItem.update({
        where: { id: stockItem.id },
        data: { quantity: newQuantity },
      });

      const transactionData: Prisma.StockTransactionUncheckedCreateInput = {
        stockItemId,
        userId: data.userId,
        type: data.type,
        quantity: data.quantity,
        departmentId: data.departmentId,
        reason: data.reason,
        approvalStatus: data.approvalStatus,
        date: data.date,
      };

      return tx.stockTransaction.create({ data: transactionData });
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.StockTransactionWhereInput;
    orderBy?: Prisma.StockTransactionOrderByWithRelationInput;
  }): Promise<StockTransaction[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.stockTransaction.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        stockItem: true,
        user: true,
        department: true,
      },
    });
  }

  async findOne(id: string): Promise<StockTransaction | null> {
    return this.prisma.stockTransaction.findUnique({
      where: { id },
      include: {
        stockItem: true,
        user: true,
        department: true,
      },
    });
  }
}
