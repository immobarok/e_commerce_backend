import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Admin } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

@Injectable()
export class UsersService implements OnModuleInit {
  private prisma: PrismaClient;

  constructor() {
    const connectionString =
      process.env.DATABASE_URL || 'postgresql://localhost:5432/ecommerce_db';
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    this.prisma = new PrismaClient({ adapter } as any);
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: { id },
    });
  }

  async create(data: {
    email: string;
    password: string;
    role?: 'SUPER_ADMIN' | 'ADMIN';
    createdBy?: number;
  }): Promise<Admin> {
    return this.prisma.admin.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role || 'ADMIN',
        createdBy: data.createdBy,
      },
    });
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.prisma.admin.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
