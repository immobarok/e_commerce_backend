import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { Admin } from '../generated/prisma/client.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string): Promise<any> {
    const admin = await this.usersService.findByEmail(email);
    if (!admin) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return null;
    }

    if (!admin.isActive) {
      throw new ForbiddenException('Account is deactivated');
    }

    const { password: _, ...result } = admin;
    return result;
  }

  async login(admin: Admin) {
    await this.usersService.updateLastLogin(admin.id);

    const payload = { email: admin.email, sub: admin.id, role: admin.role };
    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async signup(signupDto: SignupDto) {
    const existingAdmin = await this.usersService.findByEmail(signupDto.email);
    if (existingAdmin) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const admin = await this.usersService.create({
      email: signupDto.email,
      password: hashedPassword,
      role: 'SUPER_ADMIN', // First signup creates SUPER_ADMIN
    });

    const { password: _, ...result } = admin;
    return this.login(result as Admin);
  }

  async createAdmin(createAdminDto: CreateAdminDto, creatorId: number) {
    const creator = await this.usersService.findById(creatorId);
    if (creator?.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only SUPER_ADMIN can create new admins');
    }

    const existingAdmin = await this.usersService.findByEmail(
      createAdminDto.email,
    );
    if (existingAdmin) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = await this.usersService.create({
      email: createAdminDto.email,
      password: hashedPassword,
      role: 'ADMIN',
      createdBy: creatorId,
    });

    const { password: _, ...result } = admin;
    return result;
  }
}
