import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import swaggerUi from 'swagger-ui-express';
import type { Express, Request, Response } from 'express';

type OpenApiSpec = Record<string, any>;

function env(name: string, fallback = ''): string {
  return (process.env[name]?.trim() || fallback).trim();
}

/**
 * Build a base URL from the incoming request.
 * - Works behind NodePort / Ingress.
 * - trust proxy enabled so req.protocol is correct behind ingress.
 */
function inferPublicBaseUrl(req: Request) {
  const proto =
    (req.headers['x-forwarded-proto'] as string | undefined)
      ?.split(',')[0]
      ?.trim() || req.protocol;

  const host =
    (req.headers['x-forwarded-host'] as string | undefined)
      ?.split(',')[0]
      ?.trim() || req.get('host');

  return `${proto}://${host}`;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const expressApp = app.getHttpAdapter().getInstance() as Express;

  expressApp.set('trust proxy', 1);

  app.enableCors();

  const IDENTITY_URL = env('IDENTITY_URL', 'http://identity:3001');
  const FILE_URL = env('FILE_URL', 'http://filemanagement:3002');
  const MESSAGING_URL = env('MESSAGING_URL', 'http://messaging:3003');

  app.use(
    '/identity',
    createProxyMiddleware({
      target: IDENTITY_URL,
      changeOrigin: true,
      pathRewrite: { '^/identity': '' },
    }),
  );

  app.use(
    '/filemanagement',
    createProxyMiddleware({
      target: FILE_URL,
      changeOrigin: true,
      pathRewrite: { '^/filemanagement': '' },
    }),
  );

  app.use(
    '/messaging',
    createProxyMiddleware({
      target: MESSAGING_URL,
      changeOrigin: true,
      pathRewrite: { '^/messaging': '' },
    }),
  );

  const IDENTITY_DOCS_JSON = env(
    'IDENTITY_DOCS_JSON',
    `${IDENTITY_URL}/api/v1/docs-json`,
  );
  const FILE_DOCS_JSON = env('FILE_DOCS_JSON', `${FILE_URL}/api/v1/docs-json`);
  const MESSAGING_DOCS_JSON = env(
    'MESSAGING_DOCS_JSON',
    `${MESSAGING_URL}/api/v1/docs-json`,
  );

  const DIRECT_IDENTITY_URL = env('DIRECT_IDENTITY_URL');
  const DIRECT_FILE_URL = env('DIRECT_FILE_URL');
  const DIRECT_MESSAGING_URL = env('DIRECT_MESSAGING_URL');

  const serveSpec = (
    specPath: string,
    upstreamDocsJsonUrl: string,
    gatewayBasePath: string,
    directUrl?: string,
  ) => {
    expressApp.get(specPath, async (req: Request, res: Response) => {
      try {
        const response = await fetch(upstreamDocsJsonUrl);

        if (!response.ok) {
          console.error(
            `Failed to fetch spec from ${upstreamDocsJsonUrl}: ${response.status}`,
          );
          return res.status(502).json({
            error: `Failed to fetch spec from ${upstreamDocsJsonUrl}`,
            status: response.status,
          });
        }

        const spec: OpenApiSpec = await response.json();

        const publicBase = inferPublicBaseUrl(req);
        const viaGateway = `${publicBase}${gatewayBasePath}`;

        spec.servers = [{ url: viaGateway, description: 'Gateway' }];

        if (directUrl) {
          spec.servers.push({ url: directUrl, description: 'Direct' });
        }

        return res.json(spec);
      } catch (error: any) {
        console.error(`Error fetching spec ${specPath}:`, error);
        return res.status(500).json({
          error: `Failed to fetch spec: ${specPath}`,
          details: error?.message ?? String(error),
        });
      }
    });
  };

  serveSpec(
    '/specs/identity.json',
    IDENTITY_DOCS_JSON,
    '/identity',
    DIRECT_IDENTITY_URL,
  );
  serveSpec(
    '/specs/filemanagement.json',
    FILE_DOCS_JSON,
    '/filemanagement',
    DIRECT_FILE_URL,
  );
  serveSpec(
    '/specs/messaging.json',
    MESSAGING_DOCS_JSON,
    '/messaging',
    DIRECT_MESSAGING_URL,
  );

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(null, {
      explorer: true,
      swaggerOptions: {
        urls: [
          { name: 'Identity', url: '/specs/identity.json' },
          { name: 'Filemanagement', url: '/specs/filemanagement.json' },
          { name: 'Messaging', url: '/specs/messaging.json' },
        ],
        persistAuthorization: true,
      },
    }),
  );

  expressApp.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'gateway',
      timestamp: new Date().toISOString(),
    });
  });

  const port = Number(env('PORT', '3000'));
  await app.listen(port);
}

bootstrap();
