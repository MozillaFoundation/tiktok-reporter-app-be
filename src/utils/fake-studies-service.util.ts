import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CreateStudyDto } from 'src/studies/dto/create-study.dto';
import { StudiesService } from 'src/studies/studies.service';
import { Study } from 'src/studies/entities/study.entity';
import { UpdateStudyDto } from 'src/studies/dto/update-study.dto';
import { fakeCountryCodesService } from './fake-country-codes-service.util';
import { getFakeEntityRepository } from './fake-repository.util';
import { isUUID } from 'class-validator';
import { removeDuplicateObjects } from './remove-duplicates';

const fakeStudyRepository = getFakeEntityRepository<Study>();

export const fakeStudiesService: Partial<StudiesService> = {
  create: async (createStudyDto: CreateStudyDto) => {
    const foundCountryCodes = await fakeCountryCodesService.findAllById(
      createStudyDto.countryCodeIds,
    );

    if (!foundCountryCodes.length) {
      throw new BadRequestException('No Country Codes with the given id');
    }

    const newStudy = {
      name: createStudyDto.name,
      description: createStudyDto.description,
      countryCodes: foundCountryCodes,
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
    });

    if (updateStudyDto.countryCodeIds) {
      const countryCodes = await fakeCountryCodesService.findAllById(
        updateStudyDto.countryCodeIds,
      );

      const newCountryCodes = removeDuplicateObjects(
        [...foundStudy.countryCodes, ...countryCodes],
        'id',
      );

      Object.assign(foundStudy, { countryCodes: newCountryCodes });
    }

    return await fakeStudyRepository.save(foundStudy);
  },
  remove: async (id: string) => {
    const foundStudy = await fakeStudiesService.findOne(id);

    return await fakeStudyRepository.remove(foundStudy);
  },
};
