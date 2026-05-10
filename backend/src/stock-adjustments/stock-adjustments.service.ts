import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockAdjustment, Prisma } from '@prisma/client';

@Injectable()
export class StockAdjustmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<StockAdjustment> {
    console.log('Creating stock adjustment with data:', data);
    const { stockItemId, userId, oldQuantity, newQuantity, reason } = data;

    try {
      // Update the stock item quantity first
      console.log('Updating stock item', stockItemId, 'to quantity', newQuantity);
      await this.prisma.stockItem.update({
        where: { id: stockItemId },
        data: { quantity: newQuantity },
      });
      console.log('Stock item updated successfully');

      // Create the adjustment record
      console.log('Creating adjustment record');
      const adjustment = await this.prisma.stockAdjustment.create({
        data: {
          stockItemId,
          userId,
          oldQuantity,
          newQuantity,
          reason,
        },
      });
      console.log('Adjustment created successfully:', adjustment);

      return adjustment;
    } catch (error) {
      console.error('Error in stock adjustment service:', error);
      throw error;
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.StockAdjustmentWhereUniqueInput;
    where?: Prisma.StockAdjustmentWhereInput;
    orderBy?: Prisma.StockAdjustmentOrderByWithRelationInput;
  }): Promise<StockAdjustment[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.stockAdjustment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        stockItem: true,
        user: true,
      },
    });
  }

  async findOne(id: string): Promise<StockAdjustment | null> {
    return this.prisma.stockAdjustment.findUnique({
      where: { id },
      include: {
        stockItem: true,
        user: true,
      },
    });
  }

  async update(id: string, data: Prisma.StockAdjustmentUpdateInput): Promise<StockAdjustment> {
    return this.prisma.stockAdjustment.update({
      where: { id },
      data,
      include: {
        stockItem: true,
        user: true,
      },
    });
  }

  async remove(id: string): Promise<StockAdjustment> {
    return this.prisma.stockAdjustment.delete({
      where: { id },
    });
  }
}