import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PipeModule } from './common/pipe/pipe.module';
import { UtilModule } from './util/util.module';
import { LocationModule } from './location/location.module';
import { ProductModule } from './product/product.module';
import { InboundModule } from './inbound/inbound.module';
import { OutboundModule } from './outbound/outbound.module';
import { StocktakingModule } from './stocktaking/stocktaking.module';
import { LogModule } from './log/log.module';
import { ReportModule } from './report/report.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule, 
    AuthModule, 
    DatabaseModule, 
    UserModule, 
    ProjectModule, 
    PipeModule, UtilModule, LocationModule,
    ProductModule,
    InboundModule,
    OutboundModule,
    StocktakingModule,
    LogModule,
    ReportModule
    
     
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
