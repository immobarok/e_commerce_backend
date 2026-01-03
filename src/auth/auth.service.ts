import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/schemas/user.schema';
import { LoginDto, CreateAdminDto, RegisterDto, LoginResponseDto } from './dto/auth.dto';

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
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        displayProfile: user.displayProfile || "",
        address: user.address || "",
        phone: user.phone || "",
        bio: user.bio || "",
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<{ message: string; access_token: string; user: any }> {
    const { fullName, email, password, confirmPassword, displayProfile, address, phone, bio } = registerDto;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if email already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new this.userModel({
      fullName,
      email,
      password: hashedPassword,
      displayProfile,
      address,
      phone,
      bio,
      role: UserRole.USER,
      isActive: true,
    });

    await newUser.save();

    // Generate JWT token for automatic login
    const payload = { sub: newUser._id, email: newUser.email, role: newUser.role };
    const access_token = this.jwtService.sign(payload);

    return {
      message: 'User registered successfully',
      access_token,
      user: {
        id: newUser._id.toString(),
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        displayProfile: newUser.displayProfile || "",
        address: newUser.address || "",
        phone: newUser.phone || "",
        bio: newUser.bio || "",
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
      fullName: 'Admin',
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
        fullName: newAdmin.fullName,
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
      fullName: 'Super Admin',
      email,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    });

    await superAdmin.save();
    console.log('✅ Super admin created successfully');
  }

  async logoutUser(userId: string): Promise<{ message: string }> {
    // Verify user exists
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // In a JWT-based system, logout is handled client-side by removing the token
    // The server just confirms the request is valid
    return {
      message: 'Logout successful',
    };
  }
}
