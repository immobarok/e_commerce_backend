import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174','http://localhost:3001','http://localhost:3000','http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT ?? 3000;

  // Check MongoDB Connection
  const connection = app.get<Connection>(getConnectionToken());
  connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });
  connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message);
  });
  connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  // Log current connection status
  if (connection.readyState === 1) {
    console.log('MongoDB is already connected');

    // Create super admin if doesn't exist
    const authService = app.get(AuthService);
    await authService.createSuperAdmin(
      process.env.SUPER_ADMIN_EMAIL || 'superadmin@admin.com',
      process.env.SUPER_ADMIN_PASSWORD || '12345678a',
    );
  }

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
