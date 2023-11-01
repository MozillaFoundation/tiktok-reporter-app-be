import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isDefined, isUUID } from 'class-validator';
import {
  mapStudiesToDtos,
  mapStudyEntityToDto,
} from 'src/studies/mappers/mapEntitiesToDto';

import { ApiKey } from 'src/auth/entities/api-key.entity';
import { CreateStudyDto } from 'src/studies/dto/create-study.dto';
import { StudiesService } from 'src/studies/studies.service';
import { Study } from 'src/studies/entities/study.entity';
import { UpdateStudyDto } from 'src/studies/dto/update-study.dto';
import { fakeCountryCodesService } from './fake-country-codes-service.util';
import { fakeFormsService } from './fake-forms-service.util';
import { fakeOnboardingsService } from './fake-onboardings-service.util';
import { fakePoliciesService } from './fake-policies-service.util';
import { getFakeEntityRepository } from './fake-repository.util';
import { removeDuplicateObjects } from './remove-duplicates';

const fakeStudyRepository = getFakeEntityRepository<Study>();
const fakeApiKeyRepository = getFakeEntityRepository<ApiKey>();

export const fakeStudiesService: Partial<StudiesService> = {
  create: async (headerApiKey: string, createStudyDto: CreateStudyDto) => {
    const countryCodes = await fakeCountryCodesService.findAllById(
      createStudyDto.countryCodeIds,
    );

    if (!countryCodes.length) {
      throw new BadRequestException('No Country Codes with the given id');
    }

    const policies = await fakePoliciesService.findAllById(
      createStudyDto.policyIds,
    );

    if (!policies.length) {
      throw new BadRequestException('No Policies with the given id exist');
    }

    const onboarding = await fakeOnboardingsService.findOne(
      createStudyDto.onboardingId,
    );

    const form = await fakeFormsService.findOne(createStudyDto.formId);

    const savedApiKey = await fakeApiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    const newStudy = {
      name: createStudyDto.name,
      description: createStudyDto.description,
      isActive: createStudyDto.isActive,
      supportsRecording: createStudyDto.supportsRecording,
      countryCodes,
      policies,
      onboarding,
      form,
      createdBy: savedApiKey,
    } as Study;

    const createdStudy = await fakeStudyRepository.create(newStudy);
    const savedStudy = await fakeStudyRepository.save(createdStudy);

    return mapStudyEntityToDto(savedStudy);
  },
  findAll: async () => {
    const allStudies = await fakeStudyRepository.find();

    return mapStudiesToDtos(allStudies);
  },
  findByIpAddress: async (countryCode: string) => {
    const condition = isUUID(countryCode)
      ? { countryCodes: { id: countryCode } }
      : { countryCodes: { code: countryCode } };

    const areStudiesAvailable = await fakeStudyRepository.exist({
      where: condition,
      relations: {
        countryCodes: true,
      },
    });

    if (!areStudiesAvailable) {
      return await fakeStudiesService.findAll();
    }

    const foundStudies = await fakeStudyRepository.find({
      where: condition,
      relations: {
        countryCodes: true,
      },
    });

    return mapStudiesToDtos(foundStudies);
  },
  findOne: async (id: string) => {
    const foundStudy = await fakeStudyRepository.findOneBy({ id });

    if (!foundStudy) {
      throw new NotFoundException('Study not found');
    }

    return mapStudyEntityToDto(foundStudy);
  },
  update: async (
    headerApiKey: string,
    id: string,
    updateStudyDto: UpdateStudyDto,
  ) => {
    const foundStudy = await fakeStudiesService.findOne(id);
    const savedApiKey = await fakeApiKeyRepository.findOne({
      where: { key: headerApiKey },
    });
    Object.assign(foundStudy, {
      name: updateStudyDto.name || foundStudy.name,
      description: updateStudyDto.description || foundStudy.description,
      isActive: isDefined(updateStudyDto?.isActive)
        ? updateStudyDto?.isActive
        : foundStudy.isActive,
      supportsRecording: isDefined(updateStudyDto?.supportsRecording)
        ? updateStudyDto?.supportsRecording
        : foundStudy.supportsRecording,
      updatedBy: savedApiKey,
    });

    if (updateStudyDto.countryCodeIds) {
      const countryCodes = await fakeCountryCodesService.findAllById(
        updateStudyDto.countryCodeIds,
      );

      if (!countryCodes.length) {
        throw new BadRequestException(
          'No Country Codes with the given id exist',
        );
      }

      const newCountryCodes = removeDuplicateObjects(
        [...foundStudy.countryCodes, ...countryCodes],
        'id',
      );

      Object.assign(foundStudy, { countryCodes: newCountryCodes });
    }

    if (updateStudyDto.policyIds) {
      const policies = await fakePoliciesService.findAllById(
        updateStudyDto.policyIds,
      );

      if (!policies.length) {
        throw new BadRequestException('No Policies with the given id exist');
      }

      const newPolicies = removeDuplicateObjects(
        [...foundStudy.policies, ...policies],
        'id',
      );

      Object.assign(foundStudy, {
        policies: newPolicies,
      });
    }

    if (updateStudyDto.onboardingId) {
      const onboarding = await fakeOnboardingsService.findOne(
        updateStudyDto.onboardingId,
      );

      Object.assign(foundStudy, {
        onboarding,
      });
    }

    if (updateStudyDto.formId) {
      const form = await fakeFormsService.findOne(updateStudyDto.formId);

      Object.assign(foundStudy, {
        form,
      });
    }

    const updatedStudy = await fakeStudyRepository.save(foundStudy);

    return mapStudyEntityToDto(updatedStudy);
  },
  remove: async (id: string) => {
    const foundStudy = await fakeStudyRepository.findOneBy({ id });

    if (!foundStudy) {
      throw new NotFoundException('Study not found');
    }
    const removedStudy = await fakeStudyRepository.remove(foundStudy);

    return mapStudyEntityToDto(removedStudy);
  },
};

Object.assign(fakeStudiesService, {
  initApiKey: async () => {
    const createdApiKey = await fakeApiKeyRepository.create({
      key: process.env.API_KEY,
      appName: 'Dev Testing',
    });
    await fakeApiKeyRepository.save(createdApiKey);
  },
});
