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
import { isDefined, isUUID } from 'class-validator';
import { removeDuplicateObjects } from 'src/utils/remove-duplicates';
import { PoliciesService } from 'src/policies/policies.service';
import { OnboardingsService } from 'src/onboardings/onboardings.service';
import { FormsService } from 'src/forms/forms.service';

@Injectable()
export class StudiesService {
  constructor(
    private readonly countryCodeService: CountryCodesService,
    private readonly policiesService: PoliciesService,
    private readonly onboardingsService: OnboardingsService,
    private readonly formsService: FormsService,
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

    const onboarding = await this.onboardingsService.findOne(
      createStudyDto.onboardingId,
    );

    const form = await this.formsService.findOne(createStudyDto.formId);

    const createdStudy = await this.studyRepository.create({
      name: createStudyDto.name,
      description: createStudyDto.description,
      isActive: createStudyDto.isActive,
      countryCodes,
      policies,
      onboarding,
      form,
    });

    return await this.studyRepository.save(createdStudy);
  }

  async findAll() {
    return await this.studyRepository.find({
      relations: {
        countryCodes: true,
        policies: true,
        onboarding: true,
        form: true,
      },
    });
  }

  async findByCountryCode(countryCode: string) {
    const condition = isUUID(countryCode)
      ? { countryCodes: { id: countryCode } }
      : { countryCodes: { code: countryCode } };

    const areStudiesAvailable = await this.studyRepository.exist({
      where: condition,
    });

    if (!areStudiesAvailable) {
      return await this.findAll();
    }

    return await this.studyRepository.find({
      where: condition,
      relations: {
        countryCodes: true,
        policies: true,
        onboarding: true,
        form: true,
      },
    });
  }

  async findOne(id: string) {
    const study = await this.studyRepository.findOne({
      where: { id },
      relations: {
        countryCodes: true,
        policies: true,
        onboarding: true,
        form: true,
      },
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
      isActive: isDefined(updateStudyDto?.isActive)
        ? updateStudyDto.isActive
        : study.isActive,
    });

    if (updateStudyDto.countryCodeIds) {
      const countryCodes = await this.countryCodeService.findAllById(
        updateStudyDto.countryCodeIds,
      );

      if (!countryCodes.length) {
        throw new BadRequestException(
          'No Country Codes with the given id exist',
        );
      }

      Object.assign(study, {
        countryCodes: removeDuplicateObjects(
          [...study.countryCodes, ...countryCodes],
          'id',
        ),
      });
    }

    if (updateStudyDto.policyIds) {
      const policies = await this.policiesService.findAllById(
        updateStudyDto.policyIds,
      );

      if (!policies.length) {
        throw new BadRequestException('No Policies with the given id exist');
      }

      Object.assign(study, {
        policies: removeDuplicateObjects(
          [...study.policies, ...policies],
          'id',
        ),
      });
    }

    if (updateStudyDto.onboardingId) {
      const onboarding = await this.onboardingsService.findOne(
        updateStudyDto.onboardingId,
      );

      Object.assign(study, {
        onboarding,
      });
    }

    if (updateStudyDto.formId) {
      const form = await this.formsService.findOne(updateStudyDto.formId);

      Object.assign(study, {
        form,
      });
    }

    return await this.studyRepository.save(study);
  }

  async remove(id: string) {
    const study = await this.findOne(id);

    return this.studyRepository.remove(study);
  }
}
