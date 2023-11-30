import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let msg = exception.message;
    let errorMsg = (msg.charAt(0).toUpperCase() + msg.slice(1)).replace(
      /([a-z])([A-Z0-9])/g,
      '$1 $2',
    );
    response.status(status).json({
      error: exception.message,
      errorMsg,
    });
  }
}
