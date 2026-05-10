import { Module } from '@nestjs/common';
import { AssetAssignmentsService } from './asset-assignments.service';
import { AssetAssignmentsController } from './asset-assignments.controller';

@Module({
  providers: [AssetAssignmentsService],
  controllers: [AssetAssignmentsController]
})
export class AssetAssignmentsModule {}
