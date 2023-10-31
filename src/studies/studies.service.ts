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
import { isDefined } from 'class-validator';
import { removeDuplicateObjects } from 'src/utils/remove-duplicates';
import { PoliciesService } from 'src/policies/policies.service';
import { OnboardingsService } from 'src/onboardings/onboardings.service';
import { FormsService } from 'src/forms/forms.service';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import {
  mapStudiesToDtos,
  mapStudyEntityToDto,
} from './mappers/mapEntitiesToDto';
import { GeolocationService } from 'src/geolocation/geo-location.service';

@Injectable()
export class StudiesService {
  constructor(
    private readonly geolocationService: GeolocationService,
    private readonly countryCodeService: CountryCodesService,
    private readonly policiesService: PoliciesService,
    private readonly onboardingsService: OnboardingsService,
    private readonly formsService: FormsService,
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  async create(headerApiKey: string, createStudyDto: CreateStudyDto) {
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

    const savedApiKey = await this.apiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    const createdStudy = await this.studyRepository.create({
      name: createStudyDto.name,
      description: createStudyDto.description,
      isActive: createStudyDto.isActive,
      countryCodes,
      policies,
      onboarding,
      form,
      createdBy: savedApiKey,
    });

    const savedStudy = await this.studyRepository.save(createdStudy);

    return mapStudyEntityToDto(savedStudy);
  }

  async findAll() {
    const allStudies = await this.studyRepository.find();

    return mapStudiesToDtos(allStudies);
  }

  async findByIpAddress(ipAddress: string) {
    const userCountryCode =
      await this.geolocationService.getCountryCodeByIpAddress(ipAddress);

    const foundStudies = await this.studyRepository.find({
      where: { countryCodes: { code: userCountryCode } },
      relations: {
        countryCodes: true,
        policies: true,
        onboarding: {
          steps: true,
        },
        form: true,
      },
    });

    return mapStudiesToDtos(foundStudies);
  }

  async findOne(id: string) {
    const study = await this.studyRepository.findOne({
      where: { id },
      relations: {
        countryCodes: true,
        policies: true,
        onboarding: {
          steps: true,
        },
        form: true,
      },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    return mapStudyEntityToDto(study);
  }

  async update(
    headerApiKey: string,
    id: string,
    updateStudyDto: UpdateStudyDto,
  ) {
    const study = await this.findOne(id);
    const savedApiKey = await this.apiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    Object.assign(study, {
      name: updateStudyDto.name || study.name,
      description: updateStudyDto.description || study.description,
      isActive: isDefined(updateStudyDto?.isActive)
        ? updateStudyDto.isActive
        : study.isActive,
      updatedBy: savedApiKey,
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

    const updatedStudy = await this.studyRepository.save(study);

    return mapStudyEntityToDto(updatedStudy);
  }

  async remove(id: string) {
    const study = await this.studyRepository.findOne({
      where: { id },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    const removedStudy = await this.studyRepository.remove(study);

    return mapStudyEntityToDto(removedStudy);
  }
}
