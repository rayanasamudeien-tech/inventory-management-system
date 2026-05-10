import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockItem, Prisma } from '@prisma/client';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.StockItemUncheckedCreateInput): Promise<StockItem> {
    return this.prisma.stockItem.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.StockItemWhereInput;
    orderBy?: Prisma.StockItemOrderByWithRelationInput;
  }): Promise<StockItem[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.stockItem.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        location: true,
        supplier: true,
      },
    });
  }

  async findOne(id: string): Promise<StockItem | null> {
    return this.prisma.stockItem.findUnique({
      where: { id },
      include: {
        location: true,
        supplier: true,
        transactions: { include: { user: true } },
        adjustments: { include: { user: true } },
      },
    });
  }

  async update(id: string, data: Prisma.StockItemUpdateInput): Promise<StockItem> {
    return this.prisma.stockItem.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<StockItem> {
    return this.prisma.stockItem.delete({
      where: { id },
    }) as unknown as Promise<StockItem>;
  }
}
