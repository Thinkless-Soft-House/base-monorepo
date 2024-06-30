import { HttpException, HttpStatus } from '@nestjs/common';
import { GetAllServiceReponse, Response } from './crud.types';

export class SuccessHandlerResponse<T> implements Response<T> {
  ok = true;
  error: null;

  constructor(public data: T | T[] | GetAllServiceReponse<T>) {
    if (Array.isArray(data)) {
      this.data = {
        data,
        count: data.length,
      };
    }

    if (!data) {
      this.data = {} as T;
    }
  }
}

export class ErrorHandlerResponse<T> implements Response<T> {
  ok = false;
  data: null = null;
  error: HttpException;

  constructor(errorData?: {
    message: string;
    errorCode: string;
    statusCode: HttpStatus;
  }) {
    this.error = new HttpException(
      {
        message: errorData.message ?? 'Internal Server Error',
        errorCode: errorData.errorCode ?? HttpErrorCode.UNKNOWN_ERROR,
        statusCode: errorData.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      },
      errorData.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export enum HttpErrorCode {
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',

  // User-related errors
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_USER_CREDENTIALS = 'INVALID_USER_CREDENTIALS',

  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND',
  ENTITY_ALREADY_EXISTS = 'ENTITY_ALREADY_EXISTS',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Authentication and authorization errors
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  ACCESS_DENIED = 'ACCESS_DENIED',

  // External service errors
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Custom application-specific errors
}

export const defaultErrorCode: Record<HttpStatus, HttpErrorCode> = {
  [HttpStatus.BAD_REQUEST]: HttpErrorCode.BAD_REQUEST,
  [HttpStatus.UNAUTHORIZED]: HttpErrorCode.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: HttpErrorCode.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: HttpErrorCode.NOT_FOUND,
  [HttpStatus.CONFLICT]: HttpErrorCode.CONFLICT,

  // No default error code for these statuses
  [HttpStatus.SERVICE_UNAVAILABLE]: HttpErrorCode.SERVICE_UNAVAILABLE,
  [HttpStatus.TOO_MANY_REQUESTS]: HttpErrorCode.TOO_MANY_REQUESTS,
  [HttpStatus.UNPROCESSABLE_ENTITY]: HttpErrorCode.UNPROCESSABLE_ENTITY,
  [HttpStatus.PAYMENT_REQUIRED]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.METHOD_NOT_ALLOWED]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.NOT_ACCEPTABLE]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.PROXY_AUTHENTICATION_REQUIRED]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.REQUEST_TIMEOUT]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.GONE]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.LENGTH_REQUIRED]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.PRECONDITION_FAILED]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.PAYLOAD_TOO_LARGE]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.URI_TOO_LONG]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.EXPECTATION_FAILED]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.I_AM_A_TEAPOT]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.MISDIRECTED]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.FAILED_DEPENDENCY]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.PRECONDITION_REQUIRED]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.INTERNAL_SERVER_ERROR]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.NOT_IMPLEMENTED]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.BAD_GATEWAY]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.GATEWAY_TIMEOUT]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: HttpErrorCode.INTERNAL_ERROR,

  // Success codes
  [HttpStatus.CONTINUE]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.SWITCHING_PROTOCOLS]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.PROCESSING]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.EARLYHINTS]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.OK]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.CREATED]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.ACCEPTED]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.NON_AUTHORITATIVE_INFORMATION]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.NO_CONTENT]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.RESET_CONTENT]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.PARTIAL_CONTENT]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.AMBIGUOUS]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.MOVED_PERMANENTLY]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.FOUND]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.SEE_OTHER]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.NOT_MODIFIED]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.TEMPORARY_REDIRECT]: HttpErrorCode.INTERNAL_ERROR,
  [HttpStatus.PERMANENT_REDIRECT]: HttpErrorCode.INTERNAL_ERROR,
};
