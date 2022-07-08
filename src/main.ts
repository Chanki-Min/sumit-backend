import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Sumit api')
    .setDescription('Sumit의 page, slide, block 관련 api 서버입니다')
    .setVersion('0.1')
    .addBearerAuth()
    .addTag('pages')
    .addTag('slides')
    .addTag('blocks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log(`PORT: ${process.env.PORT}`);
  await app.listen(process.env.PORT);
}
bootstrap();
