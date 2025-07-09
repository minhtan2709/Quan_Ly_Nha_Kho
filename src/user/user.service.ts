import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, Role } from '@prisma/client';
import { CreateUserDto } from "./dto/create-user.dto";
import { hashPassword } from "src/util/crypto.util";
import { randomBytes } from 'crypto';
import { ResponseUserDto } from "./dto/response-user.dto";
import { plainToInstance } from "class-transformer";
import { UpdateUserDto } from "./dto/update-user.dto";


@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserById(userId: number) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return plainToInstance(ResponseUserDto, users);
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, role, ...rest } = createUserDto;
      const existingUser = await this.findUserByEmail(createUserDto.email);
      if (existingUser) {
        throw new BadRequestException("User already exists");
      }
      const salt = randomBytes(16).toString("hex");
      const hashedPassword = await hashPassword(password, salt);

      const user = await this.prisma.user.create({
        data: {
          ...rest,
          password: hashedPassword,
          salt,
          role: role as Role, // Chuyển string => enum
        },
      });
    
      return plainToInstance(ResponseUserDto, user);
      
    } catch (error) {
      throw new BadRequestException("Error creating user: " + error.message);
    }

    
  }
  


  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      throw new BadRequestException(`User doesn't exist for the given id ${userId}`);
    }

    // Chuẩn bị data update, chỉ update trường nào được truyền vào (không undefined)
    const data: any = {};
    if (updateUserDto.username) data.username = updateUserDto.username;
    if (updateUserDto.email) data.email = updateUserDto.email;
    if (updateUserDto.role) data.role = updateUserDto.role as Role;
    if (updateUserDto.status) data.status = updateUserDto.status;
    if (updateUserDto.phone_number) data.phone_number = updateUserDto.phone_number;
    if (updateUserDto.password) {
      data.password = await hashPassword(updateUserDto.password, existingUser.salt);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data
    });

    return plainToInstance(ResponseUserDto, updatedUser);
  }

  async removeUser(userId: number) {
    const result = await this.prisma.user.delete({ where: { id: userId } });
    if (!result) {
      throw new BadRequestException("User doesn't exist");
    }
    return { message: "User deleted successfully!" };
  }
}
