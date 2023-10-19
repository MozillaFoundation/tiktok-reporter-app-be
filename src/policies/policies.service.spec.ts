import { DEFAULT_GUID, defaultCreatePolicyDto } from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { Policy } from './entities/policy.entity';
import { PolicyType } from 'src/models/policyType';
import { Repository } from 'typeorm';
import { getFakeEntityRepository } from 'src/utils/fake-repository.util';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PoliciesService', () => {
  let service: PoliciesService;
  let repository: Repository<Policy>;
  const REPOSITORY_TOKEN = getRepositoryToken(Policy);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliciesService,
        {
          provide: REPOSITORY_TOKEN,
          useValue: { ...getFakeEntityRepository<Policy>() },
        },
      ],
    }).compile();

    service = module.get<PoliciesService>(PoliciesService);
    repository = module.get<Repository<Policy>>(REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have repository defined', () => {
    expect(repository).toBeDefined();
  });

  it('create returns the newly created country code', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);

    await expect(createdEntity).toBeDefined();
    await expect(createdEntity.id).toBeDefined();
    await expect(createdEntity.type).toEqual(defaultCreatePolicyDto.type);
    await expect(createdEntity.title).toEqual(defaultCreatePolicyDto.title);
    await expect(createdEntity.subtitle).toEqual(
      defaultCreatePolicyDto.subtitle,
    );
    await expect(createdEntity.text).toEqual(defaultCreatePolicyDto.text);
  });

  it('findAll returns the list of all policies including the newly created one', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);

    const allEntities = await service.findAll();

    await expect(allEntities).toBeDefined();
    await expect(allEntities.length).toBeGreaterThan(0);
    await expect(allEntities).toContain(createdEntity);
  });

  it('findAllById returns the list of policies with ids in the provided search list ', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);

    const foundCountries = await service.findAllById([createdEntity.id]);

    await expect(foundCountries).toBeDefined();
    await expect(foundCountries.length).toBeGreaterThan(0);
    await expect(foundCountries).toContain(createdEntity);
  });

  it('findOne returns newly created country code', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);

    const foundEntity = await service.findOne(createdEntity.id);

    await expect(foundEntity).toBeDefined();
    await expect(foundEntity).toEqual(createdEntity);
  });

  it('findOne throws error when no policy was found', async () => {
    await expect(service.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns the updated policy with all changes updated', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);
    const updatedType = PolicyType.PrivacyPolicy;
    const updatedTitle = 'UPDATED Title';
    const updatedSubtitle = 'UPDATED Subtitle';
    const updatedText = 'UPDATED Text';

    const updatedEntity = await service.update(createdEntity.id, {
      type: updatedType,
      title: updatedTitle,
      subtitle: updatedSubtitle,
      text: updatedText,
    });

    await expect(updatedEntity).toBeDefined();
    await expect(updatedEntity.type).toEqual(updatedType);
    await expect(updatedEntity.title).toEqual(updatedTitle);
    await expect(updatedEntity.subtitle).toEqual(updatedSubtitle);
    await expect(updatedEntity.text).toEqual(updatedText);
    await expect(updatedEntity).toEqual(createdEntity);
  });

  it('update returns the updated policy with the partial changes updated', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);
    const updatedTitle = 'UPDATED Title';

    const updatedEntity = await service.update(createdEntity.id, {
      title: updatedTitle,
    });

    await expect(updatedEntity).toBeDefined();
    await expect(updatedEntity.title).toEqual(updatedTitle);
    await expect(updatedEntity.type).toEqual(defaultCreatePolicyDto.type);
    await expect(updatedEntity.subtitle).toEqual(
      defaultCreatePolicyDto.subtitle,
    );
    await expect(updatedEntity.text).toEqual(defaultCreatePolicyDto.text);

    await expect(updatedEntity).toEqual(createdEntity);
  });

  it('update throws error when no policy was found', async () => {
    await expect(
      service.update(DEFAULT_GUID, {
        title: 'Updated Title',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the policy', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);

    const removedEntity = await service.remove(createdEntity.id);

    await expect(service.findOne(removedEntity.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no policy was found', async () => {
    await expect(service.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
