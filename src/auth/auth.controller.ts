import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, CreateAdminDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('create-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async createAdmin(@Body() createAdminDto: CreateAdminDto, @Request() req) {
    return this.authService.createAdmin(createAdminDto, req.user.userId);
  }
//logout user
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req:any) {
    return this.authService.logoutUser(req.user.userId);
  }
}
