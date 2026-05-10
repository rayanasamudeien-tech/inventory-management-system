import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AssetCategoriesService } from './asset-categories.service';
import { AssetCategoriesController } from './asset-categories.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AssetCategoriesController],
  providers: [AssetCategoriesService],
})
export class AssetCategoriesModule {}