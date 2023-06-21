import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/v1/auth.module';
import { ConnectUsersModel } from '../models/connect_users.model';
import { ConnectUsersLoginModel } from '../models/connect_login.model';
import { ConnectUsersController } from './connect.controller';
import { ConnectUsersService } from './connect.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConnectUsersModel, ConnectUsersLoginModel]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ConnectUsersController],
  providers: [ConnectUsersService],
  exports: [ConnectUsersService],
})
export class ConnectUsersModule {}
