import { BaseModel } from '@database/base.modal';

export interface Photo extends BaseModel {
  name: string;
  userId: string;
}
