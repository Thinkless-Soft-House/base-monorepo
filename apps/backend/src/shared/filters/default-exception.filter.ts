// src/shared/filters/custom-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ErrorHandlerResponse,
  HttpErrorCode,
  defaultErrorCode,
} from '../definitions/crud.model';

@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    // Verifica se a exceção já está no formato ErrorHandlerResponse
    if (exception instanceof ErrorHandlerResponse) {
      response.status(exception.error.getStatus()).json({
        ok: exception.ok,
        data: exception.data,
        error: exception.error.getResponse(),
      });
      return;
    }

    // Caso contrário, formata a exceção de acordo com ErrorHandlerResponse
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';
    let errorCode = defaultErrorCode[status] ?? HttpErrorCode.UNKNOWN_ERROR;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        (exceptionResponse.hasOwnProperty('errorCode') ||
          exceptionResponse.hasOwnProperty('code'))
      ) {
        errorCode = exceptionResponse['errorCode'] || exceptionResponse['code'];
      }
    }

    const errorResponse = new ErrorHandlerResponse({
      message,
      errorCode: errorCode,
      statusCode: status,
    });

    response.status(status).json({
      ok: errorResponse.ok,
      data: errorResponse.data,
      error: errorResponse.error.getResponse(),
    });
  }
}
