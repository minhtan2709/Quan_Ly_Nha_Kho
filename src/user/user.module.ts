import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { PrismaModule } from '../../prisma/prisma.module'; // Importing PrismaModule for database access
@Module({
    imports:
        [PrismaModule,
            TypeOrmModule.forFeature([User])
        ],
    controllers:
        [
            UserController
        ],
    providers: [UserService],
    exports: [UserService] // Exporting UserService to be used in other modules
})
export class UserModule { }