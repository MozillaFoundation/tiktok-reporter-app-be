import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { Study } from './entities/study.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudiesService {
  constructor(
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
  ) {}

  create(createStudyDto: CreateStudyDto) {
    const createdStudy = this.studyRepository.create({
      name: createStudyDto.name,
    });

    return this.studyRepository.save(createdStudy);
  }

  findAll() {
    return this.studyRepository.find();
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.studyRepository.findOneBy({ id });
  }

  async update(id: number, updateStudyDto: UpdateStudyDto) {
    const study = await this.findOne(id);

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    Object.assign(study, { ...updateStudyDto });
    return this.studyRepository.save(study);
  }

  async remove(id: number) {
    const study = await this.findOne(id);

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    return this.studyRepository.remove(study);
  }
}
