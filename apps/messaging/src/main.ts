import { NestFactory, Reflector } from '@nestjs/core';
import { MessagingModule } from './messaging.module';
import { setUpSwagger } from '../../../libs/shared/config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionHandlerFilter } from '../../../libs/shared/filter/global-exception-handler.filter';
import { SuccessResponseInterceptor } from '../../../libs/shared/filter/success-response.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(MessagingModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 400,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionHandlerFilter());
  app.useGlobalInterceptors(new SuccessResponseInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api/v1');
  setUpSwagger(app, {
    title: 'Messaging API',
    description: 'GovStack Messaging Building Block',
    version: '1.0.0',
    path: 'docs',
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://admin:admin@localhost:5672'],
      queue: 'ms_queue',
      queueOptions: { durable: true },
      noAck: false,
      exchange: 'events',
    },
  });
  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
