import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { Study } from './entities/study.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryCodesService } from 'src/countryCodes/country-codes.service';
import { isUUID } from 'class-validator';

@Injectable()
export class StudiesService {
  constructor(
    private readonly countryCodeService: CountryCodesService,
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
  ) {}

  async create(createStudyDto: CreateStudyDto) {
    const countryCode = await this.countryCodeService.findOne(
      createStudyDto.countryCodeId,
    );

    if (!countryCode) {
      throw new BadRequestException('No Country Code with the given id');
    }
    const createdStudy = await this.studyRepository.create({
      name: createStudyDto.name,
      description: createStudyDto.description,
      countryCodes: [countryCode],
    });

    return await this.studyRepository.save(createdStudy);
  }

  async findAll() {
    return await this.studyRepository.find({
      relations: {
        countryCodes: true,
      },
    });
  }

  async findByCountryCode(countryCode: string) {
    const condition = isUUID(countryCode)
      ? { countryCodes: { id: countryCode } }
      : { countryCodes: { code: countryCode } };

    const areStudiesAvailable = await this.studyRepository.exist({
      where: condition,
      relations: {
        countryCodes: true,
      },
    });

    if (!areStudiesAvailable) {
      return await this.findAll();
    }

    return await this.studyRepository.find({
      where: condition,
      relations: {
        countryCodes: true,
      },
    });
  }

  async findOne(id: string) {
    if (!id) {
      return null;
    }

    return await this.studyRepository.findOne({
      where: { id },
      relations: { countryCodes: true },
    });
  }

  async update(id: string, updateStudyDto: UpdateStudyDto) {
    const study = await this.findOne(id);

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    Object.assign(study, { ...updateStudyDto });
    return this.studyRepository.save(study);
  }

  async remove(id: string) {
    const study = await this.findOne(id);

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    return this.studyRepository.remove(study);
  }
}
