import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ContactModule } from './contact/contact.module';
import { FaqsModule } from './faqs/faqs.module';
import { AboutModule } from './about/about.module';
import { BlogsModule } from './blogs/blogs.module';
import { SubscribeModule } from './subscribe/subscribe.module';

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // MongoDB Connection
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/nest-db',
      {
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
          });
          connection.on('error', (error: any) => {
            console.error('❌ MongoDB connection error:', error);
          });
          connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
          });
          return connection;
        },
      },
    ),
    // Feature Modules
    AuthModule,
    UsersModule,
    ProductsModule,
    ContactModule,
    FaqsModule,
    AboutModule,
    BlogsModule,
    SubscribeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
