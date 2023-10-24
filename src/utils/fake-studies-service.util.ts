import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isDefined, isUUID } from 'class-validator';

import { CreateStudyDto } from 'src/studies/dto/create-study.dto';
import { StudiesService } from 'src/studies/studies.service';
import { Study } from 'src/studies/entities/study.entity';
import { UpdateStudyDto } from 'src/studies/dto/update-study.dto';
import { fakeCountryCodesService } from './fake-country-codes-service.util';
import { fakeOnboardingsService } from './fake-onboardings-service.util';
import { fakePoliciesService } from './fake-policies-service.util';
import { getFakeEntityRepository } from './fake-repository.util';
import { removeDuplicateObjects } from './remove-duplicates';
import { fakeFormsService } from './fake-forms-service.util';

const fakeStudyRepository = getFakeEntityRepository<Study>();

export const fakeStudiesService: Partial<StudiesService> = {
  create: async (createStudyDto: CreateStudyDto) => {
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

    const newStudy = {
      name: createStudyDto.name,
      description: createStudyDto.description,
      isActive: createStudyDto.isActive,
      countryCodes,
      policies,
      onboarding,
      form,
    } as Study;

    const createdStudy = fakeStudyRepository.create(newStudy);
    const savedStudy = fakeStudyRepository.save(createdStudy);

    return await savedStudy;
  },
  findAll: async () => {
    const studies = await fakeStudyRepository.find();
    return studies;
  },
  findByCountryCode: async (countryCode: string) => {
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

    return await fakeStudyRepository.find({
      where: condition,
      relations: {
        countryCodes: true,
      },
    });
  },
  findOne: async (id: string) => {
    const foundStudy = await fakeStudyRepository.findOneBy({ id });

    if (!foundStudy) {
      throw new NotFoundException('Study not found');
    }

    return foundStudy;
  },
  update: async (id: string, updateStudyDto: UpdateStudyDto) => {
    const foundStudy = await fakeStudiesService.findOne(id);

    Object.assign(foundStudy, {
      name: updateStudyDto.name || foundStudy.name,
      description: updateStudyDto.description || foundStudy.description,
      isActive: isDefined(updateStudyDto?.isActive)
        ? updateStudyDto?.isActive
        : foundStudy.isActive,
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

    return await fakeStudyRepository.save(foundStudy);
  },
  remove: async (id: string) => {
    const foundStudy = await fakeStudiesService.findOne(id);

    return await fakeStudyRepository.remove(foundStudy);
  },
};
