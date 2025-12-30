import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/schemas/user.schema';
import { LoginDto, CreateAdminDto, LoginResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userModel.findOne({ email, isActive: true });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user._id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };
  }

  async createAdmin(
    createAdminDto: CreateAdminDto,
    creatorId: string,
  ): Promise<{ message: string; admin: any }> {
    const { email, password } = createAdminDto;

    // Check if email already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = new this.userModel({
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      createdBy: creatorId,
      isActive: true,
    });

    await newAdmin.save();

    return {
      message: 'Admin created successfully',
      admin: {
        id: newAdmin._id.toString(),
        email: newAdmin.email,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
      },
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }

  // Create initial super admin (for seeding)
  async createSuperAdmin(email: string, password: string): Promise<void> {
    const existingAdmin = await this.userModel.findOne({
      role: UserRole.SUPER_ADMIN,
    });

    if (existingAdmin) {
      console.log('⚠️  Super admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdmin = new this.userModel({
      email,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    });

    await superAdmin.save();
    console.log('✅ Super admin created successfully');
  }
}
