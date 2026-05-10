import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Location, Prisma } from '@prisma/client';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LocationUncheckedCreateInput): Promise<Location> {
    return this.prisma.location.create({ data });
  }

  async findAll(): Promise<Location[]> {
    return this.prisma.location.findMany({
      include: {
        children: true,
        _count: {
          select: { assets: true, stockItems: true },
        },
      },
    });
  }

  async findOne(id: string): Promise<Location | null> {
    return this.prisma.location.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
        assets: true,
        stockItems: true,
      },
    });
  }

  async update(id: string, data: Prisma.LocationUpdateInput): Promise<Location> {
    return this.prisma.location.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Location> {
    return this.prisma.location.delete({
      where: { id },
    }) as unknown as Promise<Location>;
  }
}
