import { ErrorHandlerResponse, HttpErrorCode } from '@definitions/http.types';
import { plainToInstance } from 'class-transformer';
import {
  ValidationError,
  ValidatorOptions,
  validateOrReject,
} from 'class-validator';

import { concat, omitBy, isUndefined, isArray } from 'lodash';

export class ValidationErrorWithIndex extends ValidationError {
  index: number;

  constructor(base: ValidationError, index: number) {
    super();
    this.index = index;
    Object.assign(this, base);
  }
}

const validationDefaultConfiguration = {
  whitelist: true,
  forbidNonWhitelisted: false,
  transform: true,
  skipMissingProperties: false,
  validationError: { target: false },
};

export class ValidationConfig {
  static isValidationError(error: any) {
    return (
      isArray(error) &&
      (error[0] instanceof ValidationErrorWithIndex ||
        error[0] instanceof ValidationError)
    );
  }

  static handleError<T>(error: any) {
    let message;
    if (error[0] instanceof ValidationErrorWithIndex) {
      message = this.handleValidatorsErrorWithList(
        error as ValidationErrorWithIndex[],
      );
    } else if (error[0] instanceof ValidationError) {
      message = this.handleValidatorsErrorWithItem(error as ValidationError[]);
    }

    return new ErrorHandlerResponse<T>({
      message: message,
      statusCode: 400,
      errorCode: HttpErrorCode.VALIDATION_ERROR,
    });
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
    await validateOrReject(entity, { ...configuration } as ValidatorOptions);

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

  private static handleValidatorsErrorWithItem(error: ValidationError[]) {
    return error.map((err) => this.handleValidatorsError(err)).join(', ');
  }

  private static handleValidatorsErrorWithList(
    error: ValidationErrorWithIndex[],
  ) {
    return error
      .map((err) => `Item ${err.index} - ${this.handleValidatorsError(err)}`)
      .join(', ');
  }

  private static handleValidatorsError(
    error: ValidationError,
    parentPath: string = '',
  ): string {
    const currentPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      return `${currentPath}: ${Object.values(error.constraints).join(', ')}`;
    }

    if (error.children && error.children.length > 0) {
      return error.children
        .map((child) => this.handleValidatorsError(child, currentPath))
        .join(', ');
    }

    return '';
  }
}
