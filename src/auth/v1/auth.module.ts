import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConnectUsersModule } from 'src/connect/v1/connect.module';
import { UsersModule } from 'src/users/v1/users.module';
import { JwtConstants } from '../constants';
import { ConnectStrategy } from '../strategies/connect.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ConnectUsersModule),
    PassportModule,

    JwtModule.register({
      secret: JwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, ConnectStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
