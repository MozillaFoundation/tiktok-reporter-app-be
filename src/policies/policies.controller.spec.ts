import { DEFAULT_GUID, defaultCreatePolicyDto } from 'src/utils/constants';
import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { PolicyType } from 'src/models/policyType';
import { fakePoliciesService } from 'src/utils/fake-policies-service.util';

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
    const createdEntity = await controller.create(defaultCreatePolicyDto);

    const allCountryCodes = await controller.findAll();

    await expect(allCountryCodes).toBeDefined();
    await expect(allCountryCodes.length).toBeGreaterThan(0);
    await expect(allCountryCodes).toContain(createdEntity);
  });

  it('findOne returns newly created policy', async () => {
    const createdEntity = await controller.create(defaultCreatePolicyDto);

    const foundCountryCode = await controller.findOne(createdEntity.id);

    await expect(foundCountryCode).toBeDefined();
    await expect(foundCountryCode).toEqual(createdEntity);
  });

  it('findOne throws error when no policy was found', async () => {
    await expect(controller.findOne(DEFAULT_GUID)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update returns the updated country code with all changes updated', async () => {
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

    await expect(updatedEntity).toBeDefined();
    await expect(updatedEntity.type).toEqual(updatedType);
    await expect(updatedEntity.title).toEqual(updatedTitle);
    await expect(updatedEntity.subtitle).toEqual(updatedSubtitle);
    await expect(updatedEntity.text).toEqual(updatedText);
    await expect(updatedEntity).toEqual(createdEntity);
  });

  it('update returns the updated country code with the partial changes updated', async () => {
    const createdEntity = await controller.create(defaultCreatePolicyDto);
    const updatedTitle = 'UPDATED Title';

    const updatedEntity = await controller.update(createdEntity.id, {
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
