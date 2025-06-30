import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PipeModule } from './common/pipe/pipe.module';
import { UtilModule } from './util/util.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule, 
    AuthModule, 
    DatabaseModule, 
    UserModule, 
    RoleModule, 
    ProjectModule, 
    TaskModule, PipeModule, UtilModule
     
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
