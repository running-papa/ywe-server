import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/v1/users.module';
import { ScreensController } from './screens.controller';
import { ScreensService } from './screens.service';
import { ProductModule } from 'src/product/v1/product.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ProductModule),
    
  ],
  controllers: [ScreensController],
  providers: [ScreensService],
  exports: [ScreensService],
})
export class ScreensModule {}
