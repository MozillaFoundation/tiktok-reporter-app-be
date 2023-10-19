import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { isArray, isEmpty } from 'class-validator';

import { randomUuidv4 } from './generate-uuid';

export function getFakeEntityRepository<TEntity>(): Partial<
  Repository<TEntity>
> {
  let entities: TEntity[] = [];

  const filterEntities = (options?: FindManyOptions<TEntity>) => {
    const entityKeys = Object.keys(entities.at(0));

    for (const key of entityKeys) {
      if (!options.where[key]) {
        continue;
      }

      const [firstWhereKey] = Object.keys(options.where[key]);

      return entities.filter((entity) => {
        if (isArray(entity[key])) {
          return entity[key].find((foundEntity) => {
            console.log(foundEntity);
            console.log(options);
            return (
              foundEntity?.[firstWhereKey] ===
              options.where[key]?.[firstWhereKey]
            );
          });
        }
        return (
          entity[key]?.[firstWhereKey] === options.where[key]?.[firstWhereKey]
        );
      });
    }

    return [];
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

      return { ...newEntity, id: newId };
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
        return !isEmpty(entities);
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
        const foundEntity = entities.find(
          (entity) => entity?.['id'] === where?.['id'],
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
