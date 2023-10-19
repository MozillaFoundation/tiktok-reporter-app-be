import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CreateStudyDto } from 'src/studies/dto/create-study.dto';
import { StudiesService } from 'src/studies/studies.service';
import { Study } from 'src/studies/entities/study.entity';
import { UpdateStudyDto } from 'src/studies/dto/update-study.dto';
import { fakeCountryCodesService } from './fake-country-codes-service.util';
import { getFakeEntityRepository } from './fake-repository.util';

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
  findOne: async (id: string) => {
    const foundStudy = await fakeStudyRepository.findOneBy({ id });

    return foundStudy;
  },
  update: async (id: string, updateStudyDto: UpdateStudyDto) => {
    const foundStudy = await fakeStudyRepository.findOneBy({ id });

    if (!foundStudy) {
      throw new NotFoundException('Study not found');
    }

    Object.assign(foundStudy, { ...updateStudyDto });
    return await fakeStudyRepository.save(foundStudy);
  },
  remove: async (id: string) => {
    const foundStudy = await fakeStudyRepository.findOneBy({ id });

    if (!foundStudy) {
      throw new NotFoundException('Study not found');
    }

    return await fakeStudyRepository.remove(foundStudy);
  },
};
