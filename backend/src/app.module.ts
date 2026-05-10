import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { StockModule } from './stock/stock.module';
import { LocationsModule } from './locations/locations.module';
import { DepartmentsModule } from './departments/departments.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { StockTransactionsModule } from './stock-transactions/stock-transactions.module';
import { AssetCategoriesModule } from './asset-categories/asset-categories.module';
import { AssetAssignmentsModule } from './asset-assignments/asset-assignments.module';
import { StockAdjustmentsModule } from './stock-adjustments/stock-adjustments.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AssetsModule,
    AssetCategoriesModule,
    StockModule,
    LocationsModule,
    DepartmentsModule,
    SuppliersModule,
    MaintenanceModule,
    StockTransactionsModule,
    AssetAssignmentsModule,
    StockAdjustmentsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
