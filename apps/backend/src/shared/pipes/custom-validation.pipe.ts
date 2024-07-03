import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  private configuration = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // Adicionando a opção de transformação
    skipMissingProperties: false,
    validationError: { target: false },
  };

  constructor(options?: any) {
    this.configuration = Object.assign(this.configuration, options);
  }

  async transform(value: any, argument: ArgumentMetadata) {
    const { metatype } = argument;

    if (!metatype || this.isPrimitive(metatype)) {
      return value;
    }

    // Transformando o payload no tipo esperado
    const object = plainToInstance(metatype, value);

    try {
      // Validando o objeto transformado

      await validateOrReject(object, this.configuration);

      // Aplicando a transformação se estiver habilitada
      if (this.configuration.transform) {
        return object;
      }

      return value;
    } catch (errors) {
      throw new BadRequestException(this.formatErrors(errors));
    }
  }

  private isPrimitive(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.map((err) => {
      return {
        property: err.property,
        constraints: err.constraints,
      };
    });
  }
}
