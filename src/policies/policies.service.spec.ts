import { DEFAULT_GUID, defaultCreatePolicyDto } from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { Policy } from './entities/policy.entity';
import { PolicyType } from 'src/models/policyType';
import { Repository } from 'typeorm';
import { getFakeEntityRepository } from 'src/utils/fake-repository.spec.util';
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

  it('create returns the newly created policy', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toBeDefined();
    expect(createdEntity.type).toEqual(defaultCreatePolicyDto.type);
    expect(createdEntity.title).toEqual(defaultCreatePolicyDto.title);
    expect(createdEntity.subtitle).toEqual(defaultCreatePolicyDto.subtitle);
    expect(createdEntity.text).toEqual(defaultCreatePolicyDto.text);
  });

  it('findAll returns the list of all policies including the newly created one', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);

    const allEntities = await service.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toContain(createdEntity);
  });

  it('findAppPolicies returns the list of all policies not related to a study', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);

    const allEntities = await service.findAppPolicies();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toContain(createdEntity);
  });

  it('findAllById returns the list of policies with ids in the provided search list ', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);

    const foundEntities = await service.findAllById([createdEntity.id]);

    expect(foundEntities).toBeDefined();
    expect(foundEntities.length).toBeGreaterThan(0);
    expect(foundEntities).toContain(createdEntity);
  });

  it('findOne returns newly created policy', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);

    const foundEntity = await service.findOne(createdEntity.id);

    expect(foundEntity).toBeDefined();
    expect(foundEntity).toEqual(createdEntity);
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

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.type).toEqual(updatedType);
    expect(updatedEntity.title).toEqual(updatedTitle);
    expect(updatedEntity.subtitle).toEqual(updatedSubtitle);
    expect(updatedEntity.text).toEqual(updatedText);
    expect(updatedEntity).toEqual(createdEntity);
  });

  it('update returns the updated policy with the partial changes updated', async () => {
    const createdEntity = await service.create(defaultCreatePolicyDto);
    const updatedTitle = 'UPDATED Title';

    const updatedEntity = await service.update(createdEntity.id, {
      title: updatedTitle,
    });

    expect(updatedEntity).toBeDefined();
    expect(updatedEntity.title).toEqual(updatedTitle);
    expect(updatedEntity.type).toEqual(defaultCreatePolicyDto.type);
    expect(updatedEntity.subtitle).toEqual(defaultCreatePolicyDto.subtitle);
    expect(updatedEntity.text).toEqual(defaultCreatePolicyDto.text);

    expect(updatedEntity).toEqual(createdEntity);
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
