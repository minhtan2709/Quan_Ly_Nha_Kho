// src/users/dto/create-user.dto.ts
import { IsString, IsEmail, Length, IsOptional, IsIn, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(4, 20)
  username: string;

  @IsString()
  @Length(6, 20)
  password: string; // Có thể thêm validate độ mạnh mật khẩu

  @IsEmail()
  email: string;

  @IsString()
  @IsIn(['ADMIN', 'STAFF','VIEWER'], { message: 'role must be admin, viewer or staff' })
  role: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string; // Có thể optional vì đã có default = 'active'

  @Matches(/^[0-9]{10}$/, { message: 'phone_number must be 10 digits' })
  phone_number: string;
}
