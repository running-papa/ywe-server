import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { setupSwagger } from 'src/util/swagger';
async function bootstrap() {
  const port = process.env.PORT || 3000;
  // console.log('실행 포트?', port);
  // console.log('env 파일path = ', `${__dirname}/config/env/.development.env`);
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
