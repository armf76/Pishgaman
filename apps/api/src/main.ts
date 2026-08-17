import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  console.log('[BOOT] 1. bootstrap started');

  console.log('[BOOT] 2. creating Nest application...');
  const app = await NestFactory.create(AppModule);
  console.log('[BOOT] 3. Nest application created');

  console.log('[BOOT] 4. enabling CORS...');
  app.enableCors({
    origin: true,
    credentials: true,
  });
  console.log('[BOOT] 5. CORS enabled');

  console.log('[BOOT] 6. configuring ValidationPipe...');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  console.log('[BOOT] 7. ValidationPipe configured');

  console.log('[BOOT] 8. building Swagger config...');
  const config = new DocumentBuilder()
    .setTitle('Pishgaman API')
    .setDescription(
      'Technical, Legal and Registration Platform API',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  console.log('[BOOT] 9. Swagger config built');

  console.log('[BOOT] 10. creating Swagger document...');
  const document = SwaggerModule.createDocument(app, config);
  console.log('[BOOT] 11. Swagger document created');

  console.log('[BOOT] 12. configuring Swagger route...');
  SwaggerModule.setup('api', app, document);
  console.log('[BOOT] 13. Swagger route configured');

  const port = Number(process.env.PORT) || 3001;

  console.log(`[BOOT] 14. starting HTTP server on port ${port}...`);
  await app.listen(port);
  console.log('[BOOT] 15. HTTP server started');

  console.log(`API: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  console.error('[BOOT] FATAL ERROR');
  console.error(error);
  process.exit(1);
});