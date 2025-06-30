import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { request, response } from "express";
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);
    catch(exception: any, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        const isHttpException =  exception instanceof HttpException;

        const status = isHttpException
            ? (exception as HttpException).getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse =  isHttpException
            ?(exception as HttpException).getResponse()
            : {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error'
            }

        const responsePayload = {
            statusCode: status,
            error: true,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: typeof errorResponse === 'object'
                ? (errorResponse as any).message || errorResponse
                : errorResponse,
            // stack: exception.stack
        };
            this.logger.error(`
            ${request.method} ${request.url}`,
                    JSON.stringify(responsePayload),
                    `AllExceptionFilter`
            );
            response.status(status).json(responsePayload);
    }
    
}

