import { Module } from '@nestjs/common';
import { StockTransactionsService } from './stock-transactions.service';
import { StockTransactionsController } from './stock-transactions.controller';

@Module({
  providers: [StockTransactionsService],
  controllers: [StockTransactionsController]
})
export class StockTransactionsModule {}
