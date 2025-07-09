import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
export class LoginDto {
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must contain atleast 6 characters' })
    @MaxLength(20, {message: 'Password must be less than 20 characters'})
    password: string;
}