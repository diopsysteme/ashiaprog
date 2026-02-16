import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

type SwaggerSetupOptions = {
  title: string;
  description?: string;
  version?: string;
  path?: string;
};

export function setUpSwagger(app: INestApplication, opts: SwaggerSetupOptions) {
  const {
    title,
    description = 'API documentation',
    version = '1.0.0',
    path = 'docs',
  } = opts;

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup(path, app, document, {
    useGlobalPrefix: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  return document;
}
