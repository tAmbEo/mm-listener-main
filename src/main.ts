import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ResInterceptor } from './app.interceptor';
import { HttpExceptionFilter } from './app.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));
  app.useGlobalInterceptors(new ResInterceptor());
  if (process.env.ROUTE) app.setGlobalPrefix(process.env.ROUTE);
  app.enableCors();
  app.disable('x-powered-by');
  
  await app.listen(process.env.PORT);
}

bootstrap();
