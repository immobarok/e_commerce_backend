export class LoginDto {
  email: string;
  password: string;
}

export class CreateAdminDto {
  email: string;
  password: string;
}

export class RegisterDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
