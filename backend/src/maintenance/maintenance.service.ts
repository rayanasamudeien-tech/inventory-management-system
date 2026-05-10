import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MaintenanceRequest, Prisma, AssetStatus } from '@prisma/client';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MaintenanceRequestUncheckedCreateInput): Promise<MaintenanceRequest> {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.maintenanceRequest.create({ data });

      // Update asset status to NEEDS_REPAIR if not already
      await tx.asset.update({
        where: { id: request.assetId },
        data: { status: AssetStatus.NEEDS_REPAIR },
      });

      return request;
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.MaintenanceRequestWhereInput;
    orderBy?: Prisma.MaintenanceRequestOrderByWithRelationInput;
  }): Promise<MaintenanceRequest[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.maintenanceRequest.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        asset: true,
        requester: true,
        technician: true,
        logs: true,
      },
    });
  }

  async updateStatus(id: string, status: string, technicianId?: string): Promise<MaintenanceRequest> {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.maintenanceRequest.update({
        where: { id },
        data: { 
          status,
          technicianId: technicianId || undefined,
        },
      });

      // Update asset status based on maintenance status
      let assetStatus: AssetStatus | undefined;
      if (status === 'IN_PROGRESS') assetStatus = AssetStatus.UNDER_REPAIR;
      if (status === 'COMPLETED') assetStatus = AssetStatus.REPAIRED;

      if (assetStatus) {
        await tx.asset.update({
          where: { id: request.assetId },
          data: { status: assetStatus },
        });
      }

      return request;
    });
  }
}
