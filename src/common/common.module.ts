import { Global, Module } from '@nestjs/common';
import { ValidIdPipe } from './pipe/valid-id.pipe';
import { ResponseInterceptor } from './interceptor/reponse.interceptor';
@Global()
@Module({
providers: [ValidIdPipe, ResponseInterceptor],
exports: [ValidIdPipe]
    })
export class CommonModule {}