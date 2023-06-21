import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
/**
 * Swagger 세팅
 *
 * @param {INestApplication} app
 */
//웹 페이지를 새로고침을 해도 Token 값 유지
const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: false,
    validatorUrl: 'http://localhost:43001/terms/location',
  },
};

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('YWE API Docs')
    .setDescription('NND API 정의서')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  //api 문서 프로덕션 진행시 보안 관련 추가
  //if (process.env.NODE_ENV == 'production') {
  app.use(
    ['/api-docs', '/api-docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PWD,
      },
    }),
  );
  //}
  const document = SwaggerModule.createDocument(app, options);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  SwaggerModule.setup('api-docs', app, document, swaggerCustomOptions);
}
