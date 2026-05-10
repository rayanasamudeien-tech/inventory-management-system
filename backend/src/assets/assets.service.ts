import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Asset, Prisma } from '@prisma/client';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AssetCreateInput): Promise<Asset> {
    return this.prisma.asset.create({
      data,
      include: {
        category: true,
        location: true,
        department: true,
        supplier: true,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AssetWhereUniqueInput;
    where?: Prisma.AssetWhereInput;
    orderBy?: Prisma.AssetOrderByWithRelationInput;
  }): Promise<Asset[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.asset.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        category: true,
        location: true,
        department: true,
        supplier: true,
      },
    });
  }

  async findOne(id: string): Promise<Asset | null> {
    return this.prisma.asset.findUnique({
      where: { id },
      include: {
        category: true,
        location: true,
        department: true,
        supplier: true,
        photos: true,
        documents: true,
        assignments: { include: { user: true } },
      },
    });
  }

  async update(id: string, data: Prisma.AssetUpdateInput): Promise<Asset> {
    return this.prisma.asset.update({
      where: { id },
      data,
      include: {
        category: true,
        location: true,
        department: true,
        supplier: true,
      },
    });
  }

  async remove(id: string): Promise<Asset> {
    // Delete related records first to avoid foreign key constraint errors
    await this.prisma.assetPhoto.deleteMany({
      where: { assetId: id },
    });
    await this.prisma.assetDocument.deleteMany({
      where: { assetId: id },
    });
    await this.prisma.assetAssignment.deleteMany({
      where: { assetId: id },
    });
    await this.prisma.assetTransfer.deleteMany({
      where: { assetId: id },
    });
    await this.prisma.assetDisposal.deleteMany({
      where: { assetId: id },
    });
    await this.prisma.maintenanceRequest.deleteMany({
      where: { assetId: id },
    });

    return this.prisma.asset.delete({
      where: { id },
    });
  }
}
