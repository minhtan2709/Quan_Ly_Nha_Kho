import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Res, Response, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@common/interceptor/reponse.interceptor';
import { AllExceptionFilter } from '@common/exception/all.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
  app.useGlobalFilters(new AllExceptionFilter());
  app.enableCors({
    origin: '*', // Hoặc truyền domain cụ thể: ['http://localhost:3001']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
