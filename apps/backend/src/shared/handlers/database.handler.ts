import { GetOptions, Relation } from '@definitions/crud.types';
import { SelectQueryBuilder } from 'typeorm';

export default class DatabaseHandler {
  static builderGetOptionsByQueryParams(query: any): GetOptions {
    const getOptions: GetOptions = {};

    if (query.page && query.pageSize) {
      getOptions.pagination = {
        page: parseInt(query.page, 10),
        size:
          parseInt(query.pageSize, 10) > 100
            ? 100
            : parseInt(query.pageSize, 10),
      };
    }

    if (query.orderField && query.orderDirection) {
      getOptions.order = {
        field: query.orderField,
        direction: query.orderDirection,
      };
    }

    if (query.filters) {
      getOptions.filters = JSON.parse(query.filters);
    }

    if (query.relations) {
      getOptions.relations = this.buildRelations(query.relations);
    }

    console.log('getOptions after query builder obj', getOptions);
    return getOptions;
  }

  static buildRelations(relation: string): Relation[] {
    if (relation) {
      return relation.split(',').map((r) => ({
        path: r.split(':')[0],
        name: r.split(':')[1],
      }));
    } else {
      return [];
    }
  }

  static builderGetOptions(
    getOptions: GetOptions,
    config: { idColumn?: string } = {},
  ) {
    const parsedGetOptions = getOptions;
    console.log('getOptions before', getOptions);

    if (!getOptions.pagination) {
      parsedGetOptions.pagination = {
        page: 1,
        size: 10,
      };
    }

    if (!getOptions.order) {
      parsedGetOptions.order = {
        field: config.idColumn || 'id',
        direction: 'ASC',
      };
    }
    if (!getOptions.filters) {
      parsedGetOptions.filters = [];
    }

    if (!getOptions.relations) {
      parsedGetOptions.relations = [];
    }
    return parsedGetOptions;
  }

  static builderPagination(
    page: number,
    size: number,
  ): {
    limit: number;
    offset: number;
  } {
    const limit = size;
    const offset = (page - 1) * size;

    return {
      limit,
      offset,
    };
  }

  static getRelations<T>(
    table: string,
    query: SelectQueryBuilder<T>,
    relation: { path: string; name: string }[],
  ): SelectQueryBuilder<T> {
    if (relation.length) {
      relation.forEach((rel) => {
        query.leftJoinAndSelect(`${table}.${rel.path}`, rel.name);
      });
    }

    return query;
  }

  static applyFilters<T>(
    queryBuilder: SelectQueryBuilder<T>,
    filters: GetOptions['filters'],
  ): SelectQueryBuilder<T> {
    if (!filters) return queryBuilder;

    filters.forEach((filter) => {
      const { field, operator, value } = filter;
      switch (operator) {
        case 'eq':
          queryBuilder.andWhere(`${field} = :value`, { value });
          break;
        case 'ne':
          queryBuilder.andWhere(`${field} != :value`, { value });
          break;
        case 'gt':
          queryBuilder.andWhere(`${field} > :value`, { value });
          break;
        case 'lt':
          queryBuilder.andWhere(`${field} < :value`, { value });
          break;
        case 'gte':
          queryBuilder.andWhere(`${field} >= :value`, { value });
          break;
        case 'lte':
          queryBuilder.andWhere(`${field} <= :value`, { value });
          break;
        case 'like':
          queryBuilder.andWhere(`${field} ILIKE :value`, {
            value: `${value}`,
          });
          break;
        case 'in':
          if (Array.isArray(value)) {
            queryBuilder.andWhere(`${field} IN (:...value)`, { value });
          } else {
            queryBuilder.andWhere(`${field} IN (:value)`, { value });
          }
          break;
        default:
          throw new Error(`Unknown operator: ${operator}`);
      }
    });

    return queryBuilder;
  }
}
