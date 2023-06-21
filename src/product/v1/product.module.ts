import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/v1/users.module';
import { ProductModel } from '../models/product.model';
import { ProductChargingModel } from '../models/product_charging.model';
import { ProductNoticeModel } from '../models/product_notice.model';
import { ProductPaymentModel } from '../models/product_payment.model';
import { ProductReservationModel } from '../models/product_reservation.model';
import { ProductTermsModel } from '../models/product_terms';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([
      ProductModel,
      ProductReservationModel,
      ProductChargingModel,
      ProductPaymentModel,
      // ProductPushModel,
      // ProductNoticeModel,
      // ProductTermsModel,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
