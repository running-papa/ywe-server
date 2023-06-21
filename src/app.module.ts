import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/v1/users.module';
import { AuthModule } from './auth/v1/auth.module';
import { ProductModule } from './product/v1/product.module';
import { ConnectUsersModule } from './connect/v1/connect.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        // process.env.NODE_ENV == 'development'
        //   ? `${__dirname}/config/env/.development.env`
        //   : '.env.production',
        [`${__dirname}/config/env/.development.env`],
    }),
    TypeOrmModule.forRoot({
      type:
        process.env.DB_TYPE == 'mysql'
          ? 'mysql'
          : process.env.DB_TYPE == 'sqlite'
          ? 'sqlite'
          : 'sqlite',
      host:
        process.env.NODE_ENV == 'production'
          ? process.env.DB_HOST_DEV
          : process.env.DB_HOST_DEV,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database:
        process.env.NODE_ENV == 'production'
          ? process.env.DB_NAME_LIVE
          : process.env.DB_NAME_DEV,
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
      keepConnectionAlive: true,
      entities: [__dirname, '../**/*.entity.ts'],
    }),
    AuthModule,
    UsersModule,
    ProductModule,
    ConnectUsersModule,
    // realestateModule,
    // basketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
