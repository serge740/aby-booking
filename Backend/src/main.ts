import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { json, urlencoded } from 'express';
import * as express from 'express';
import { join, extname, basename } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    rawBody:true
  });

  // Middleware
  app.use(cookieParser());

  // Raw body for Stripe webhooks
  app.use('/webhooks/stripe', bodyParser.raw({ type: 'application/json' }));

  // Extended JSON parsing
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Static files from /uploads with proper headers
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'uploads'), {
      setHeaders: (res, filePath) => {
        const fileName = basename(filePath);
        const ext = extname(filePath).toLowerCase();

        // Detect content type based on extension
        let contentType = 'application/octet-stream'; // fallback

        switch (ext) {
          case '.pdf':
            contentType = 'application/pdf';
            break;
          case '.jpg':
          case '.jpeg':
            contentType = 'image/jpeg';
            break;
          case '.png':
            contentType = 'image/png';
            break;
          case '.svg':
            contentType = 'image/svg+xml';
            break;
          case '.webp':
            contentType = 'image/webp';
            break;
          case '.gif':
            contentType = 'image/gif';
            break;
          case '.txt':
            contentType = 'text/plain';
            break;
          case '.doc':
            contentType = 'application/msword';
            break;
          case '.docx':
            contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            break;
          // Add more types as needed
        }
res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        res.setHeader('Content-Type', contentType);

        // Security and CORS headers
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.setHeader('Content-Security-Policy', "default-src 'self' data:; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
        res.setHeader('Referrer-Policy', 'no-referrer');
        res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=(), camera=()');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // or your real frontend URL
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      },
    }),
  );

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
