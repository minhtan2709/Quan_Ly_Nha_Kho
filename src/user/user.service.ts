import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { hashPassword } from "src/util/crypto.util";
import { randomBytes } from 'crypto';
import { ResponseUserDto } from "./dto/response-user.dto";
import { plainToInstance } from "class-transformer";
import { UpdateUserDto } from "./dto/update-user.dto";
import { create } from "domain";
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}
    async findUserByEmail(email: string) {
        return  this.userRepository.findOne({ where: { email } });
         
    }
    async findUserById(userId: number) {
        return  this.userRepository.findOne({where: { id: userId}});
        
    }

    async findAll() {
        const users = await this.userRepository.find();
        return plainToInstance(ResponseUserDto, users)

    }
    
    async createUser(createUserDto: CreateUserDto ): Promise<ResponseUserDto> {
    const existingUser = await this.findUserByEmail(createUserDto.email);
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
        const salt = randomBytes(16).toString('hex');
        const hashedPassword = await hashPassword(createUserDto.password, salt)
        const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword, salt });
        
        const savedUser = await this.userRepository.save(newUser);
        return plainToInstance(ResponseUserDto, savedUser)
            
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
        // Tìm user theo id (trả về entity gốc, không phải DTO)
        const existingUser = await this.findUserById(userId);
        if (!existingUser) {
            throw new BadRequestException(`User doesn't exist for the given id ${userId}`);
        }

        if (updateUserDto.password) {
            existingUser.password = await hashPassword(updateUserDto.password, existingUser.salt);
        }
        
        Object.assign(existingUser, { ...updateUserDto, password: existingUser.password });

        const savedUser = await this.userRepository.save(existingUser);
        return plainToInstance(ResponseUserDto, savedUser);
    }
    
    async removeUser(userId: number) {
        const result = await this.userRepository.delete(userId)
        if (!result.affected) {
            throw new BadRequestException("User doesn't exist")
        }
        return {
            message: "User deleted successfully!"
        }
    }
}