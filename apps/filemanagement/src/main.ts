import { NestFactory } from '@nestjs/core';
import { FilemanagementModule } from './filemanagement.module';
import { setUpSwagger } from '../../../libs/shared/config/swagger.config';
import { SuccessResponseInterceptor } from '../../../libs/shared/filter/success-response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionHandlerFilter } from '../../../libs/shared/filter/global-exception-handler.filter';

async function bootstrap() {
  const app = await NestFactory.create(FilemanagementModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 400,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionHandlerFilter());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.setGlobalPrefix('api/v1');
  setUpSwagger(app, {
    title: 'FILE API',
    description: 'GovStack FILE Building Block',
    version: '1.0.0',
    path: 'docs',
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
