import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOperator,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { arrayNotEmpty, isArray, isEmpty } from 'class-validator';

import { isFilledArray } from './isFilledArray';
import { randomUuidv4 } from './generate-uuid';

const uniqueValues = (value, index, array) => {
  return array.indexOf(value) === index;
};

export function getFakeEntityRepository<TEntity>(): Partial<
  Repository<TEntity>
> {
  let entities: TEntity[] = [];

  const filterEntities = (options?: FindManyOptions<TEntity>) => {
    const entityKeys = Object.keys(entities.at(0));

    const filterEntitiesSingleCondition = (
      entities: TEntity[],
      where: FindOptionsWhere<TEntity>,
    ) => {
      const [first] = Object.keys(where);
      const condition = where[first];
      let filteredEntities: TEntity[] = [...entities];

      if (!entityKeys.includes(first)) {
        const [firstConditionKey] = Object.keys(condition);

        filteredEntities = filteredEntities.filter((entity) => {
          if (
            condition?.[firstConditionKey].type === 'isNull' &&
            isEmpty(entity?.[first])
          ) {
            return true;
          }
          return false;
        });
      }

      for (const key of entityKeys) {
        if (!where[key]) {
          continue;
        }

        let firstWhereKey, firstWhereCondition;
        if (where[key] instanceof FindOperator) {
          firstWhereKey = key;
          firstWhereCondition = where;
        } else {
          firstWhereKey = Object.keys(where[key])[0];
          firstWhereCondition = where[key];
        }

        if (
          firstWhereCondition[firstWhereKey] !== null &&
          firstWhereCondition[firstWhereKey].type === 'isNull'
        ) {
          filteredEntities = filteredEntities.filter(
            (entity) =>
              entity[key] === null ||
              (Array.isArray(entity[key]) &&
                (!isFilledArray(entity[key]) || !arrayNotEmpty(entity[key]))),
          );
          continue;
        }
        filteredEntities = filteredEntities.filter((entity) => {
          if (isArray(entity[key])) {
            return entity[key].find((foundEntity) => {
              if (!where[key]?.[firstWhereKey]) {
                return true;
              }
              return (
                foundEntity?.[firstWhereKey] === where[key]?.[firstWhereKey]
              );
            });
          }
          return entity[key]?.[firstWhereKey] === where[key]?.[firstWhereKey];
        });
      }

      return filteredEntities;
    };
    const whereIsArray = isArray(options.where);
    let filteredEntities: TEntity[] = [];
    if (whereIsArray) {
      const nestedFilteredEntities = (
        options.where as FindOptionsWhere<TEntity>[]
      ).map((where) => filterEntitiesSingleCondition(entities, where));
      // Flatten and deduplicate multiple where conditions
      filteredEntities = nestedFilteredEntities.flat().filter(uniqueValues);
    } else {
      filteredEntities = filterEntitiesSingleCondition(
        entities,
        options.where as FindOptionsWhere<TEntity>,
      );
    }

    return filteredEntities;
  };
  const hasOtherPropertiesThan = (
    property: string,
    options?: FindManyOptions<TEntity>,
  ) => {
    return !options || !Object.keys(options).some((x) => x !== property);
  };
  return {
    create: jest.fn().mockImplementation((newEntity: DeepPartial<TEntity>) => {
      const newId = randomUuidv4();

      return { ...newEntity, id: newId, createdAt: new Date() };
    }),
    find: jest.fn().mockImplementation((options?: FindManyOptions<TEntity>) => {
      if (hasOtherPropertiesThan('relations', options)) {
        return entities;
      }

      return filterEntities(options);
    }),
    exist: jest
      .fn()
      .mockImplementation((options?: FindManyOptions<TEntity>) => {
        const entities = filterEntities(options);

        return entities.length > 0;
      }),
    findBy: jest
      .fn()
      .mockImplementation(
        (where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[]) => {
          if (where['id'].type === 'in') {
            if (!where['id'].value) {
              return [];
            }

            const foundEntities = entities.filter((entity) =>
              where['id'].value.includes(entity?.['id']),
            );

            return foundEntities;
          }

          const foundEntity = entities.find(
            (entity) => entity?.['id'] === where?.['id'],
          );

          return foundEntity;
        },
      ),
    findOneBy: jest
      .fn()
      .mockImplementation(
        (where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[]) => {
          const foundEntity = entities.find(
            (entity) => entity?.['id'] === where?.['id'],
          );

          return foundEntity;
        },
      ),
    findOne: jest
      .fn()
      .mockImplementation((options: FindOneOptions<TEntity>) => {
        const where = options?.['where'];
        const [firstWhereKey] = Object.keys(where);
        const foundEntity = entities.find(
          (entity) => entity?.[firstWhereKey] === where?.[firstWhereKey],
        );

        return foundEntity;
      }),
    save: jest.fn().mockImplementation((newEntity: DeepPartial<TEntity>) => {
      const foundCountryCodeIndex = entities.findIndex(
        (entity) => entity?.['id'] === newEntity?.['id'],
      );

      if (foundCountryCodeIndex >= 0) {
        entities[foundCountryCodeIndex] = {
          ...entities[foundCountryCodeIndex],
          ...newEntity,
        } as TEntity;
        return entities[foundCountryCodeIndex];
      }

      newEntity['updatedAt'] = new Date();

      entities.push(newEntity as TEntity);

      return newEntity;
    }),
    remove: jest
      .fn()
      .mockImplementation((entityToDelete: DeepPartial<TEntity>) => {
        const foundCountryCode = entities.find(
          (entity) => entity?.['id'] === entityToDelete?.['id'],
        );

        entities = entities.filter(
          (entity) => entity?.['id'] !== entityToDelete?.['id'],
        );

        return Promise.resolve(foundCountryCode);
      }),
  };
}
