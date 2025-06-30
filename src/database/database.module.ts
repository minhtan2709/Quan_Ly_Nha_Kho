import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import databaseConfig from 'src/common/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig], // Load config từ database.config.ts
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        url: configService.get<string>('database.url'), // Đảm bảo lấy DATABASE_URL
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        migrationsRun: true,
        synchronize: configService.get<boolean>('database.sync'),
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
