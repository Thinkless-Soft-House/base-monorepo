import { BaseModel } from '@database/base.modal';

export interface User extends BaseModel {
  name: string;
  email: string;
  password: string;
}
