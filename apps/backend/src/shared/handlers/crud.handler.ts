/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidationConfig } from '@config/validation.config';
import { ErrorHandlerResponse } from '@definitions/http.types';

export class CrudHandler {
  static builderErrorHandler<T>(error: any) {
    // console.log('error', error);
    if (error instanceof ErrorHandlerResponse) {
      throw error;
    } else if (ValidationConfig.isValidationError(error)) {
      throw ValidationConfig.handleError<T>(error);
    } else {
      throw new ErrorHandlerResponse<T>();
    }
  }
}
