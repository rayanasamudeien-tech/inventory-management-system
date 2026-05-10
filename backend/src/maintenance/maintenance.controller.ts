import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query, Request } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('maintenance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'INVENTORY_MANAGER', 'TECHNICIAN')
  create(
    @Request() req,
    @Body() createDto: Prisma.MaintenanceRequestUncheckedCreateInput,
  ) {
    const requesterId = req.user?.userId ?? req.user?.sub;
    return this.maintenanceService.create({
      ...createDto,
      requesterId,
    });
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('assetId') assetId?: string,
  ) {
    const where: Prisma.MaintenanceRequestWhereInput = {};
    if (status) where.status = status;
    if (assetId) where.assetId = assetId;

    return this.maintenanceService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TECHNICIAN')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('technicianId') technicianId?: string,
  ) {
    return this.maintenanceService.updateStatus(id, status, technicianId);
  }
}
