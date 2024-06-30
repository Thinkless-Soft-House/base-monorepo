// src/shared/pipes/default-value.pipe.ts
import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class DefaultValuePipe implements PipeTransform {
  constructor(private readonly defaultValue: any) {}

  transform(value: any) {
    if (value === undefined || value === null) {
      return this.defaultValue;
    }
    return value;
  }
}
