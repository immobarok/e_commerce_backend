import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): object {
    return this.usersService.getAllUsers(page, limit);
  }

  @Get(':id')
  getUserById(@Param('id') id: string): object {
    return this.usersService.getUserById(id);
  }
}
