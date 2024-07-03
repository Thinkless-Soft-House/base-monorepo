import {
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  Put,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import type {
  IsCrudService,
  IsEntityModel,
  Response,
} from '@definitions/crud.types';
import {
  ErrorHandlerResponse,
  SuccessHandlerResponse,
} from '@definitions/http.types';
import DatabaseHandler from '@handlers/database.handler';
import { CrudHandler } from '@handlers/crud.handler';
import { ConfigService } from '@nestjs/config';

export class CrudController<
  Entity extends IsEntityModel,
  Service extends IsCrudService<Entity>,
  CreateEntityDTO,
  UpdateEntityDTO,
> {
  protected validation = {};
  constructor(
    private readonly service: Service,
    private readonly cs: ConfigService,
    private readonly createEntityDtoClass: new () => CreateEntityDTO,
    private readonly updateEntityDtoClass: new () => UpdateEntityDTO,
  ) {
    const validationDTO = cs.get('validationDTO');
    this.validation = {
      transform: validationDTO.transform,
      whitelist: validationDTO.whitelist,
      forbidNonWhitelisted: validationDTO.forbidNonWhitelisted,
    };
  }

  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('orderField') orderField: string,
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC',
    @Query('filters') filters: string,
    @Query('relations') relations: string,
  ): Promise<Response<Entity>> {
    console.log('filters', filters);
    try {
      const options = DatabaseHandler.builderGetOptionsByQueryParams({
        page,
        pageSize,
        orderField,
        orderDirection,
        filters,
        relations,
      });
      const res = await this.service.getAll(options);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw new ErrorHandlerResponse<Entity>();
    }
  }

  @Get('single/:id')
  async getOne(
    @Param('id') id: string,
    @Query('relations') relations: string,
  ): Promise<Response<Entity>> {
    try {
      const rels = DatabaseHandler.buildRelations(relations);
      const res = await this.service.getOne(id, rels);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }

  @Post('single')
  async createOne(@Body() createDto: any): Promise<Response<Entity>> {
    try {
      await CrudHandler.validationDTO(
        {
          metatype: this.createEntityDtoClass,
          object: createDto,
        },
        this.validation,
      );
      const res = await this.service.createOne(createDto);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }

  @Post('many')
  async createMany(
    @Body() createManyDto: CreateEntityDTO[],
  ): Promise<Response<Entity>> {
    try {
      await CrudHandler.validationListDTO(
        {
          metatype: this.createEntityDtoClass,
          object: createManyDto,
        },
        this.validation,
      );
      const res = await this.service.createMany(createManyDto);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }

  @Put('single')
  async setOne(@Body() updateDto: UpdateEntityDTO): Promise<Response<Entity>> {
    try {
      await CrudHandler.validationDTO(
        {
          metatype: this.updateEntityDtoClass,
          object: updateDto,
        },
        this.validation,
      );
      const res = await this.service.setOne(updateDto);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }

  @Put('many')
  async setMany(
    @Body() updateManyDto: UpdateEntityDTO[],
  ): Promise<Response<Entity>> {
    try {
      await CrudHandler.validationListDTO(
        {
          metatype: this.createEntityDtoClass,
          object: updateManyDto,
        },
        this.validation,
      );
      const res = await this.service.updateMany(updateManyDto);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }
  @Patch('single/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateDto: UpdateEntityDTO,
  ): Promise<Response<Entity>> {
    try {
      await CrudHandler.validationDTO(
        {
          metatype: this.updateEntityDtoClass,
          object: updateDto,
        },
        this.validation,
      );
      const res = await this.service.updateOne(id, updateDto);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }

  @Patch('many')
  async updateMany(
    @Body() updateManyDto: UpdateEntityDTO[],
  ): Promise<Response<Entity>> {
    try {
      await CrudHandler.validationListDTO(
        {
          metatype: this.createEntityDtoClass,
          object: updateManyDto,
        },
        this.validation,
      );
      const res = await this.service.updateMany(updateManyDto);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }

  @Delete('single/:id')
  async deleteOne(@Param('id') id: string): Promise<Response<Entity>> {
    try {
      const res = await this.service.deleteOne(id);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }

  @Delete('many')
  async deleteMany(@Body() ids: string[]): Promise<Response<Entity>> {
    try {
      const res = await this.service.deleteMany(ids);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }
}
