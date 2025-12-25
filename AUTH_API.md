# Authentication API Documentation

## Overview

This API provides authentication functionality with role-based access control. There are two roles:

- **SUPER_ADMIN**: Can create new admins
- **ADMIN**: Regular admin user

## Endpoints

### 1. Signup (First Time Setup)

Creates the first SUPER_ADMIN account.

**POST** `/auth/signup`

**Body:**

```json
{
  "email": "superadmin@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "email": "superadmin@example.com",
    "role": "SUPER_ADMIN"
  }
}
```

---

### 2. Login

Authenticate with email and password.

**POST** `/auth/login`

**Body:**

```json
{
  "email": "superadmin@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "email": "superadmin@example.com",
    "role": "SUPER_ADMIN"
  }
}
```

---

### 3. Create Admin (SUPER_ADMIN Only)

Only SUPER_ADMIN can create new admin accounts.

**POST** `/auth/admin/create`

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "id": 2,
  "email": "admin@example.com",
  "role": "ADMIN",
  "isActive": true,
  "createdBy": 1,
  "createdAt": "2025-12-25T10:00:00.000Z",
  "updatedAt": "2025-12-25T10:00:00.000Z"
}
```

---

## Usage Flow

### Step 1: Create First SUPER_ADMIN

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@example.com",
    "password": "SecurePass123"
  }'
```

### Step 2: Login as SUPER_ADMIN

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@example.com",
    "password": "SecurePass123"
  }'
```

### Step 3: Create New Admin (using SUPER_ADMIN token)

```bash
curl -X POST http://localhost:3000/auth/admin/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123"
  }'
```

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Only SUPER_ADMIN can create new admins",
  "error": "Forbidden"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

---

## Security Notes

1. **JWT Secret**: Change the `JWT_SECRET` in your `.env` file in production
2. **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
3. **Token Expiration**: JWT tokens expire after 7 days
4. **Role-Based Access**: Only SUPER_ADMIN can create new admins
5. **Active Status**: Deactivated accounts cannot login

---

## Database Schema

```prisma
model Admin {
  id          Int       @id @default(autoincrement())
  email       String    @unique
  password    String
  role        AdminRole @default(ADMIN)
  isActive    Boolean   @default(true)
  createdBy   Int?
  creator     Admin?    @relation("AdminCreator", fields: [createdBy], references: [id])
  created     Admin[]   @relation("AdminCreator")
  lastLoginAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
}
```
