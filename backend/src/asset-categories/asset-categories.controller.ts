import { Controller, Get } from '@nestjs/common';
import { AssetCategoriesService } from './asset-categories.service';

@Controller('asset-categories')
export class AssetCategoriesController {
  constructor(private readonly assetCategoriesService: AssetCategoriesService) {
    console.log('AssetCategoriesController instantiated');
  }

  @Get()
  findAll() {
    console.log('AssetCategoriesController.findAll called');
    return this.assetCategoriesService.findAll();
  }
}