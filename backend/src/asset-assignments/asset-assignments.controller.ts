import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { AssetAssignmentsService } from './asset-assignments.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('asset-assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssetAssignmentsController {
  constructor(private readonly assetAssignmentsService: AssetAssignmentsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'INVENTORY_MANAGER')
  create(@Body() createDto: Prisma.AssetAssignmentCreateInput) {
    return this.assetAssignmentsService.create(createDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('assetId') assetId?: string,
    @Query('userId') userId?: string,
  ) {
    const where: Prisma.AssetAssignmentWhereInput = {};
    if (assetId) where.assetId = assetId;
    if (userId) where.userId = userId;

    return this.assetAssignmentsService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      where,
      orderBy: { assignedAt: 'desc' },
    });
  }

  @Patch(':id/return')
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'INVENTORY_MANAGER')
  returnAsset(@Param('id') id: string) {
    return this.assetAssignmentsService.returnAsset(id);
  }
}
