import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // Get total assets count
    const totalAssets = await this.prisma.asset.count();

    // Get total consumables (stock items)
    const totalConsumables = await this.prisma.stockItem.aggregate({
      _sum: {
        quantity: true,
      },
    });

    // Get under repair count (maintenance requests that are not completed)
    const underRepair = await this.prisma.maintenanceRequest.count({
      where: {
        status: {
          not: 'COMPLETED',
        },
      },
    });

    // Get low stock alerts (items below threshold)
    const lowStockAlerts = await this.prisma.stockItem.count({
      where: {
        quantity: {
          lte: this.prisma.stockItem.fields.minThreshold,
        },
      },
    });

    return {
      totalAssets,
      totalConsumables: totalConsumables._sum.quantity || 0,
      underRepair,
      lowStockAlerts,
    };
  }

  async getChartData() {
    // Get weekly asset movements (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyTransactions = await this.prisma.stockTransaction.findMany({
      where: {
        date: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        date: true,
        type: true,
        quantity: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Group by day
    const dailyData = {};
    weeklyTransactions.forEach(transaction => {
      const day = transaction.date.toISOString().split('T')[0];
      if (!dailyData[day]) {
        dailyData[day] = 0;
      }
      // Count movements (both receive and issue)
      dailyData[day] += transaction.quantity;
    });

    // Convert to chart format
    const barData = Object.entries(dailyData).map(([date, total]) => ({
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      total,
    }));

    // Get inventory distribution by category
    const categoryDistribution = await this.prisma.stockItem.groupBy({
      by: ['categoryId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
    });

    // Use categoryId as category name since no category table exists
    const pieData = categoryDistribution.map(item => ({
      name: item.categoryId || 'Unknown',
      value: item._sum.quantity || 0,
    }));

    return {
      barData,
      pieData,
    };
  }

  async getReportData() {
    // Asset Register
    const assets = await this.prisma.asset.findMany({
      include: {
        category: true,
        location: true,
        assignments: {
          where: {
            returnedAt: null,
          },
          include: {
            user: true,
          },
        },
      },
    });

    const assetRegister = assets.map(asset => [
      asset.id,
      asset.name,
      asset.category?.name || 'Unknown',
      asset.location?.name || 'Unknown',
      asset.condition,
    ]);

    // Low Stock Report
    const lowStockItems = await this.prisma.stockItem.findMany({
      where: {
        quantity: {
          lte: this.prisma.stockItem.fields.minThreshold,
        },
      },
      include: {
        location: true,
      },
    });

    const lowStockReport = lowStockItems.map(item => [
      item.name,
      `${item.quantity} ${item.unit}`,
      item.minThreshold?.toString() || '0',
      item.location?.name || 'Unknown',
    ]);

    // Maintenance History
    const maintenanceHistory = await this.prisma.maintenanceRequest.findMany({
      include: {
        asset: true,
        technician: true,
        logs: {
          select: {
            cost: true,
          },
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    const maintenanceReport = maintenanceHistory.map(request => [
      request.asset?.name || 'Unknown',
      request.description,
      request.technician?.firstName + ' ' + request.technician?.lastName || 'Unassigned',
      request.logs[0]?.cost?.toString() || '0',
      request.status,
    ]);

    // Supplier Performance
    const suppliers = await this.prisma.supplier.findMany({
      include: {
        _count: {
          select: {
            stockItems: true,
          },
        },
      },
    });

    const supplierReport = suppliers.map(supplier => [
      supplier.name,
      supplier.category,
      supplier._count.stockItems.toString(),
      '4.5', // Mock rating for now
    ]);

    return {
      assetRegister,
      lowStockReport,
      maintenanceReport,
      supplierReport,
    };
  }
}