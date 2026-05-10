import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssetAssignment, Prisma, AssetStatus } from '@prisma/client';

@Injectable()
export class AssetAssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AssetAssignmentCreateInput): Promise<AssetAssignment> {
    return this.prisma.$transaction(async (tx) => {
      const asset = await tx.asset.findUnique({
        where: { id: (data.asset as any).connect.id },
      });

      if (!asset) {
        throw new BadRequestException('Asset not found');
      }

      if (asset.status !== AssetStatus.FUNCTIONAL) {
        throw new BadRequestException('Asset is not in functional status and cannot be assigned');
      }

      // Check if already assigned
      const existingAssignment = await tx.assetAssignment.findFirst({
        where: { assetId: asset.id, status: 'ACTIVE' },
      });

      if (existingAssignment) {
        throw new BadRequestException('Asset is already assigned');
      }

      // Update asset location/department if provided in assignment or logic
      // For now, just create the assignment
      return tx.assetAssignment.create({ data });
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AssetAssignmentWhereInput;
    orderBy?: Prisma.AssetAssignmentOrderByWithRelationInput;
  }): Promise<AssetAssignment[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.assetAssignment.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        asset: true,
        user: true,
      },
    });
  }

  async returnAsset(id: string): Promise<AssetAssignment> {
    return this.prisma.assetAssignment.update({
      where: { id },
      data: {
        status: 'RETURNED',
        returnedAt: new Date(),
      },
    });
  }
}
