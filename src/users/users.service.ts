import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getAllUsers(page?: number, limit?: number): object {
    const currentPage = page || 1;
    const pageLimit = limit || 10;
    return {
      success: true,
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
      ],
      pagination: {
        page: currentPage,
        limit: pageLimit,
        total: 3,
        totalPages: 1,
      },
    };
  }

  getUserById(id: string): object {
    return {
      success: true,
      data: {
        id: parseInt(id),
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-12-31T00:00:00.000Z',
      },
    };
  }
}
