import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

interface ApiResponse<T> {
    statusCode: any,
    message: string;
    data?: T
}
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
    private readonly logger = new Logger(ResponseInterceptor.name);
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ApiResponse<T>> {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        this.logger.debug(`Incoming Request: ${method} ${url}`);
        return next.handle().pipe(
            map((data: any) => {
                let message = 'Success';
                if (data.message) {
                    message = data.message;
                    delete data.message;
                }
                return {
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message,
                    data,
                }
            }),
            tap(({ statusCode }) => {
            this.logger.log(`Outgoing response ${method} ${url} Status: ${statusCode}`);
            })
        );
    }
}
