import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetCategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    console.log('AssetCategoriesService.findAll called');
    try {
      const result = await this.prisma.assetCategory.findMany({
        orderBy: { name: 'asc' },
      });
      console.log('AssetCategoriesService.findAll result:', result);
      return result;
    } catch (error) {
      console.error('AssetCategoriesService.findAll error:', error);
      throw error;
    }
  }
}