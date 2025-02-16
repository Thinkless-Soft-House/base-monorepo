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
  UseInterceptors,
} from '@nestjs/common';
import type {
  IsCrudService,
  IsEntityModel,
  IsUpdateEntityDTO,
  Response,
} from '@definitions/crud.types';
import {
  ErrorHandlerResponse,
  SuccessHandlerResponse,
} from '@definitions/http.types';
import DatabaseHandler from '@handlers/database.handler';
import { CrudHandler } from '@handlers/crud.handler';
import { ConfigService } from '@nestjs/config';
import { CacheList } from '@decorators/cache.decorator';
import { TransactionInterceptor } from '@interceptors/transaction.interceptor';
import { ValidationConfig } from '@config/validation.config';

export class CrudController<
  Entity extends IsEntityModel,
  Service extends IsCrudService<Entity>,
  CreateEntityDTO,
  SetEntityDTO extends IsUpdateEntityDTO,
  UpdateEntityDTO extends IsUpdateEntityDTO,
> {
  protected validation = {};
  constructor(
    private readonly service: Service,
    private readonly cs: ConfigService,
    private readonly createEntityDtoClass: new () => CreateEntityDTO,
    private readonly setEntityDtoClass: new () => SetEntityDTO,
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
  @CacheList()
  @UseInterceptors(TransactionInterceptor)
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('orderField') orderField: string,
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC',
    @Query('filters') filters: string,
    @Query('relations') relations: string,
  ): Promise<Response<Entity>> {
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
    @Param('id', ParseIntPipe) id: number,
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
      const obj = await ValidationConfig.validationDTO(
        {
          metatype: this.createEntityDtoClass,
          object: createDto,
        },
        this.validation,
      );
      const res = await this.service.createOne(obj);
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
      const obj = await ValidationConfig.validationListDTO(
        {
          metatype: this.createEntityDtoClass,
          object: createManyDto,
        },
        this.validation,
      );
      const res = await this.service.createMany(obj);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }

  @Put('single')
  async setOne(@Body() updateDto: UpdateEntityDTO): Promise<Response<Entity>> {
    try {
      const obj = await ValidationConfig.validationDTO(
        {
          metatype: this.setEntityDtoClass,
          object: updateDto,
        },
        this.validation,
      );
      const res = await this.service.setOne(obj);
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
      const obj = await ValidationConfig.validationListDTO(
        {
          metatype: this.setEntityDtoClass,
          object: updateManyDto,
        },
        this.validation,
      );
      const res = await this.service.setMany(obj);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }
  @Patch('single/:id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEntityDTO,
  ): Promise<Response<Entity>> {
    try {
      const obj = await ValidationConfig.validationDTO(
        {
          metatype: this.updateEntityDtoClass,
          object: updateDto,
        },
        this.validation,
      );
      const res = await this.service.updateOne(id, obj);
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
      const obj = await ValidationConfig.validationListDTO(
        {
          metatype: this.updateEntityDtoClass,
          object: updateManyDto,
        },
        this.validation,
      );
      const res = await this.service.updateMany(obj.filter((o) => o.id));
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }

  @Delete('single/:id')
  async deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<Entity>> {
    try {
      const res = await this.service.deleteOne(id);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }

  @Delete('many')
  async deleteMany(@Body() ids: number[]): Promise<Response<Entity>> {
    try {
      const res = await this.service.deleteMany(ids);
      return new SuccessHandlerResponse<Entity>(res);
    } catch (error) {
      throw CrudHandler.builderErrorHandler<Entity>(error);
    }
  }
}
