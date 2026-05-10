import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('assets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'INVENTORY_MANAGER')
  create(@Body() createAssetDto: Prisma.AssetCreateInput) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    const where: Prisma.AssetWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { assetId: { contains: search, mode: 'insensitive' } },
            { serialNumber: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return this.assetsService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      where,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'INVENTORY_MANAGER', 'TECHNICIAN')
  update(@Param('id') id: string, @Body() updateAssetDto: Prisma.AssetUpdateInput) {
    return this.assetsService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'SCHOOL_ADMIN')
  remove(@Param('id') id: string) {
    return this.assetsService.remove(id);
  }
}
