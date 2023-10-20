import { DEFAULT_GUID, defaultCreatePolicyDto } from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { PolicyType } from 'src/models/policyType';
import { fakePoliciesService } from 'src/utils/fake-policies-service..spec.util';

describe('PoliciesController', () => {
  let controller: PoliciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoliciesController],
      providers: [{ provide: PoliciesService, useValue: fakePoliciesService }],
    }).compile();

    controller = module.get<PoliciesController>(PoliciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns the newly created policy', async () => {
    const createdEntity = await controller.create(defaultCreatePolicyDto);

    expect(createdEntity).toBeDefined();
    expect(createdEntity.id).toBeDefined();
    expect(createdEntity.type).toEqual(defaultCreatePolicyDto.type);
    expect(createdEntity.title).toEqual(defaultCreatePolicyDto.title);
    expect(createdEntity.subtitle).toEqual(defaultCreatePolicyDto.subtitle);
    expect(createdEntity.text).toEqual(defaultCreatePolicyDto.text);
  });

  it('findAll returns the list of all policies including the newly created one', async () => {
    const createdEntity = await controller.create(defaultCreatePolicyDto);

    const allEntities = await controller.findAll();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toContain(createdEntity);
  });

  it('findAppPolicies returns the list of all policies not related to a study', async () => {
    const createdEntity = await controller.create(defaultCreatePolicyDto);

    const allEntities = await controller.findAppPolicies();

    expect(allEntities).toBeDefined();
    expect(allEntities.length).toBeGreaterThan(0);
    expect(allEntities).toContain(createdEntity);
  });

  it('findOne returns newly created policy', async () => {
    const createdEntity = await controller.create(defaultCreatePolicyDto);

    const foundEntity = await controller.findOne(createdEntity.id);

    expect(foundEntity).toBeDefined();
    expect(foundEntity).toEqual(createdEntity);
  });

  it('findOne throws error when no policy was found', async () => {
    await expect(controller.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns the updated policy with all changes updated', async () => {
    const createdEntity = await controller.create(defaultCreatePolicyDto);

    const updatedType = PolicyType.PrivacyPolicy;
    const updatedTitle = 'UPDATED Title';
    const updatedSubtitle = 'UPDATED Subtitle';
    const updatedText = 'UPDATED Text';

    const updatedEntity = await controller.update(createdEntity.id, {
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
    const createdEntity = await controller.create(defaultCreatePolicyDto);
    const updatedTitle = 'UPDATED Title';

    const updatedEntity = await controller.update(createdEntity.id, {
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
      controller.update(DEFAULT_GUID, {
        title: 'UPDATED Title',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove removes the policy', async () => {
    const createdEntity = await controller.create(defaultCreatePolicyDto);

    const removedEntity = await controller.remove(createdEntity.id);
    await expect(controller.findOne(removedEntity.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('remove throws error when no policy was found', async () => {
    await expect(controller.remove(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });
});
