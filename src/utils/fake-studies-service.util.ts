import { CreateStudyDto } from 'src/studies/dto/create-study.dto';
import { NotFoundException } from '@nestjs/common';
import { StudiesService } from 'src/studies/studies.service';
import { Study } from 'src/studies/entities/study.entity';
import { UpdateStudyDto } from 'src/studies/dto/update-study.dto';
import { fakeStudyRepository } from './fake-studies-repository.util';

export const fakeStudiesService: Partial<StudiesService> = {
  create: async (createStudyDto: CreateStudyDto) => {
    const newStudy = {
      name: createStudyDto.name,
    } as Study;

    const createdStudy = fakeStudyRepository.create(newStudy);
    const savedStudy = fakeStudyRepository.save(createdStudy);

    return await savedStudy;
  },
  findAll: async () => {
    const studies = await fakeStudyRepository.find();
    return studies;
  },
  findOne: async (id: number) => {
    const foundStudy = await fakeStudyRepository.findOneBy({ id });

    return foundStudy;
  },
  update: async (id: number, updateStudyDto: UpdateStudyDto) => {
    const foundStudy = await fakeStudyRepository.findOneBy({ id });

    if (!foundStudy) {
      throw new NotFoundException('Study not found');
    }

    Object.assign(foundStudy, { ...updateStudyDto });
    return await fakeStudyRepository.save(foundStudy);
  },
  remove: async (id: number) => {
    const foundStudy = await fakeStudyRepository.findOneBy({ id });

    if (!foundStudy) {
      throw new NotFoundException('Study not found');
    }

    return await fakeStudyRepository.remove(foundStudy);
  },
};
