import { Controller, Get, Param, Patch,Body, Post, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { ValidIdPipe } from "../common/pipe/valid-id.pipe";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }
    @Get()
    async getUsers() {
        return this.userService.findAll()
    }
    @Get(':userId')
    async getUser(@Param('userId', ValidIdPipe) userId: number) {
        return this.userService.findUserById(userId);
    }
    @Post()
    async createUser(createUserDto: CreateUserDto) {
        // Here you would typically call a service method to create a user
        return this.userService.createUser(createUserDto);
    }
    @Patch(':userId')
    async updateUser(@Param('userId', ValidIdPipe) userId: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(userId, updateUserDto);
    }
    @Delete(':userId')
    async deleteUser(@Param('userId', ValidIdPipe) userId: number) {
        return this.userService.removeUser(userId);
    }
    
}