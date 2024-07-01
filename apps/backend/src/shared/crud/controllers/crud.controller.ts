import { Get, Post, Delete, Body, Param, Patch, Put } from '@nestjs/common';
import type {
  IsCrudService,
  IsEntityModel,
  Response,
} from '@definitions/crud.types';
import {
  ErrorHandlerResponse,
  SuccessHandlerResponse,
} from '@definitions/crud.model';

export class CrudController<
  Entity extends IsEntityModel,
  Service extends IsCrudService<Entity>,
  CreateEntityDTO,
  UpdateEntityDTO,
> {
  constructor(private readonly service: Service) {}

  @Get()
  async getAll(): Promise<Response<Entity>> {
    try {
      const res = await this.service.getAll();
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw new ErrorHandlerResponse<Entity>();
    }
  }

  @Get('single/:id')
  async getOne(@Param('id') id: string): Promise<Response<Entity>> {
    try {
      const res = await this.service.getOne(id);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw new ErrorHandlerResponse<Entity>();
    }
  }

  @Post('single')
  async createOne(
    @Body() createDto: CreateEntityDTO,
  ): Promise<Response<Entity>> {
    try {
      const res = await this.service.createOne(createDto);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw new ErrorHandlerResponse<Entity>();
    }
  }

  @Post('many')
  async createMany(
    @Body() createManyDto: CreateEntityDTO[],
  ): Promise<Response<Entity>> {
    try {
      const res = await this.service.createMany(createManyDto);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw new ErrorHandlerResponse<Entity>();
    }
  }

  @Put('single')
  async setOne(
    @Param('id') id: string,
    @Body() updateDto: UpdateEntityDTO,
  ): Promise<Response<Entity>> {
    try {
      const res = await this.service.updateOne(id, updateDto);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw new ErrorHandlerResponse<Entity>();
    }
  }

  @Put('many')
  async setMany(
    @Body() updateManyDto: UpdateEntityDTO[],
  ): Promise<Response<Entity>> {
    try {
      const res = await this.service.updateMany(updateManyDto);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw new ErrorHandlerResponse<Entity>();
    }
  }
  @Patch('single/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateDto: UpdateEntityDTO,
  ): Promise<Response<Entity>> {
    try {
      const res = await this.service.updateOne(id, updateDto);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw new ErrorHandlerResponse<Entity>();
    }
  }

  @Patch('many')
  async updateMany(
    @Body() updateManyDto: UpdateEntityDTO[],
  ): Promise<Response<Entity>> {
    try {
      const res = await this.service.updateMany(updateManyDto);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw new ErrorHandlerResponse<Entity>();
    }
  }

  @Delete('single/:id')
  async deleteOne(@Param('id') id: string): Promise<Response<Entity>> {
    try {
      const res = await this.service.deleteOne(id);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw new ErrorHandlerResponse<Entity>();
    }
  }

  @Delete('many')
  async deleteMany(@Body() ids: string[]): Promise<Response<Entity>> {
    try {
      const res = await this.service.deleteMany(ids);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw new ErrorHandlerResponse<Entity>();
    }
  }
}
