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
import { removeDuplicateObjects } from 'src/utils/remove-duplicates';
import { PoliciesService } from 'src/policies/policies.service';

@Injectable()
export class StudiesService {
  constructor(
    private readonly countryCodeService: CountryCodesService,
    private readonly policiesService: PoliciesService,
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
  ) {}

  async create(createStudyDto: CreateStudyDto) {
    const countryCodes = await this.countryCodeService.findAllById(
      createStudyDto.countryCodeIds,
    );

    if (!countryCodes.length) {
      throw new BadRequestException('No Country Codes with the given id exist');
    }

    const policies = await this.policiesService.findAllById(
      createStudyDto.policyIds,
    );

    if (!policies.length) {
      throw new BadRequestException('No Policies with the given id exist');
    }

    const createdStudy = await this.studyRepository.create({
      name: createStudyDto.name,
      description: createStudyDto.description,
      countryCodes,
      policies,
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
        policies: true,
      },
    });

    if (!areStudiesAvailable) {
      return await this.findAll();
    }

    return await this.studyRepository.find({
      where: condition,
      relations: {
        countryCodes: true,
        policies: true,
      },
    });
  }

  async findOne(id: string) {
    if (!id) {
      return null;
    }

    const study = await this.studyRepository.findOne({
      where: { id },
      relations: { countryCodes: true, policies: true },
    });
    if (!study) {
      throw new NotFoundException('Study not found');
    }

    return study;
  }

  async update(id: string, updateStudyDto: UpdateStudyDto) {
    const study = await this.findOne(id);

    Object.assign(study, {
      name: updateStudyDto.name || study.name,
      description: updateStudyDto.description || study.description,
    });

    if (updateStudyDto.countryCodeIds) {
      Object.assign(study, {
        countryCodes: this.getUpdatedCountryCodes(study, updateStudyDto),
      });
    }

    if (updateStudyDto.policyIds) {
      Object.assign(study, {
        policies: this.getUpdatedPolicies(study, updateStudyDto),
      });
    }

    return await this.studyRepository.save(study);
  }

  async getUpdatedCountryCodes(study: Study, updateStudyDto: UpdateStudyDto) {
    const countryCodes = await this.countryCodeService.findAllById(
      updateStudyDto.countryCodeIds,
    );

    return removeDuplicateObjects(
      [...study.countryCodes, ...countryCodes],
      'id',
    );
  }

  async getUpdatedPolicies(study: Study, updateStudyDto: UpdateStudyDto) {
    const policies = await this.policiesService.findAllById(
      updateStudyDto.policyIds,
    );

    return removeDuplicateObjects([...study.policies, ...policies], 'id');
  }

  async remove(id: string) {
    const study = await this.findOne(id);

    return this.studyRepository.remove(study);
  }
}
