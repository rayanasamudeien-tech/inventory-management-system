import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Supplier } from '@prisma/client';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSupplierDto): Promise<Supplier> {
    return this.prisma.supplier.create({ data });
  }

  async findAll(): Promise<Supplier[]> {
    return this.prisma.supplier.findMany({
      include: {
        _count: {
          select: { assets: true, stockItems: true, purchaseOrders: true },
        },
      },
    });
  }

  async findOne(id: string): Promise<Supplier | null> {
    return this.prisma.supplier.findUnique({
      where: { id },
      include: {
        assets: true,
        stockItems: true,
        purchaseOrders: true,
      },
    });
  }

  async update(id: string, data: UpdateSupplierDto): Promise<Supplier> {
    return this.prisma.supplier.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Supplier> {
    return this.prisma.supplier.delete({
      where: { id },
    }) as unknown as Promise<Supplier>;
  }
}
