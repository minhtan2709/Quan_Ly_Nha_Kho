import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dto/login.dto";
import { comparePassword } from "src/util/crypto.util";
import { JwtService } from '@nestjs/jwt';
import { ResponseUserDto } from "@user/dto/response-user.dto";
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }
    async register(createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    async login(user: any) {
    try {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            access_token: accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    } catch (err) {
        console.error('[login] Error:', err);
        throw new InternalServerErrorException('Could not generate token');
    }
}



    async validateUser(email: string, password: string) {
        const user = await this.userService.findUserByEmail(email);
        if(!user) {
            throw new BadRequestException('User does not exist for the given email')
        }
        const isPasswordCorrect = await comparePassword(password, user.salt, user.password);
        if (isPasswordCorrect) {
            return user;
        }
        return null;
        
    
    }
}