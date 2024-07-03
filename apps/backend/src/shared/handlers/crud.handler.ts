/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorHandlerResponse, HttpErrorCode } from '@definitions/http.types';
import { plainToInstance } from 'class-transformer';
import {
  ValidationError,
  ValidatorOptions,
  isArray,
  validateOrReject,
} from 'class-validator';

import { concat, omitBy, isUndefined } from 'lodash';

const validationDefaultConfiguration = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  skipMissingProperties: false,
  validationError: { target: false },
};

class ValidationErrorWithIndex extends ValidationError {
  index: number;

  constructor(base: ValidationError, index: number) {
    super();
    this.index = index;
    Object.assign(this, base);
  }
}

export class CrudHandler {
  static builderErrorHandler<T>(error: any) {
    console.log('error', error);
    if (error instanceof ErrorHandlerResponse) {
      throw error;
    } else if (isArray(error) && error[0] instanceof ValidationErrorWithIndex) {
      const messageError = (error as ValidationErrorWithIndex[])
        .map((err) => (err.constraints ? err.constraints : err))
        .map(
          (err, index) =>
            `Item ${(error as ValidationErrorWithIndex[])[index].index} - ${Object.values(err).join(', ')}`,
        )
        .join(', ');

      throw new ErrorHandlerResponse<T>({
        message: messageError,
        statusCode: 400,
        errorCode: HttpErrorCode.VALIDATION_ERROR,
      });
    } else if (isArray(error) && error[0] instanceof ValidationError) {
      const messageError = (error as ValidationError[])
        .map((err) => (err.constraints ? err.constraints : err))
        .map((err) => Object.values(err).join(', '))
        .join(', ');

      throw new ErrorHandlerResponse<T>({
        message: messageError,
        statusCode: 400,
        errorCode: HttpErrorCode.VALIDATION_ERROR,
      });
    } else {
      throw new ErrorHandlerResponse<T>();
    }
  }

  static async validationDTO<T>(
    val: { metatype: T; object: any },
    customConfiguration: ValidatorOptions = {},
  ) {
    const { metatype } = val;
    let { object } = val;
    object = omitBy(object, isUndefined);
    const entity = plainToInstance(metatype as any, object, {});

    const configuration = Object.assign(
      validationDefaultConfiguration,
      customConfiguration,
    );
    await validateOrReject(entity, configuration);

    if (configuration.transform) {
      return entity;
    }
    return object;
  }
  static async validationListDTO<T>(
    val: { metatype: T; object: any[] },
    customConfiguration: ValidatorOptions = {},
  ) {
    const { metatype, object } = val;
    const transformed = [];
    let validationsErrors = [];
    const configuration = Object.assign(
      validationDefaultConfiguration,
      customConfiguration,
    );
    for (const iterator of object) {
      const entity = plainToInstance(
        metatype as any,
        omitBy(iterator, isUndefined),
      );

      try {
        await validateOrReject(
          entity as any,
          {
            ...configuration,
            forbidNonWhitelisted: false,
          } as ValidatorOptions,
        );
      } catch (error) {
        validationsErrors.push(
          error.map(
            (err) =>
              new ValidationErrorWithIndex(err, object.indexOf(iterator)),
          ),
        );
      }

      if (configuration.transform) transformed.push(entity);
    }

    if (validationsErrors.length > 0) {
      validationsErrors = concat(...validationsErrors);
      throw validationsErrors;
    }

    if (configuration.transform) {
      return transformed;
    }
    return object;
  }
}
