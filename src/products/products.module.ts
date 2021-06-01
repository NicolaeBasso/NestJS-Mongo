import { ProductsController } from './products.controller';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
