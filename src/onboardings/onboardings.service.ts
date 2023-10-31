import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Onboarding } from './entities/onboarding.entity';
import { CreateOnboardingDto } from './dtos/create-onboarding.dto';
import { OnboardingStepsService } from 'src/onboardingSteps/onboarding-steps.service';
import { UpdateOnboardingDto } from './dtos/update-onboarding.dto';
import { removeDuplicateObjects } from 'src/utils/remove-duplicates';
import { FormsService } from 'src/forms/forms.service';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import {
  mapOnboardingEntityToDto,
  mapOnboardingsToDtos,
} from './mappers/mapEntitiesToDto';

@Injectable()
export class OnboardingsService {
  constructor(
    private readonly onboardingStepsService: OnboardingStepsService,
    private readonly formsService: FormsService,
    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  async create(headerApiKey: string, createOnboardingDto: CreateOnboardingDto) {
    const onboardingSteps = await this.onboardingStepsService.findAllById(
      createOnboardingDto.stepIds,
    );

    if (!onboardingSteps.length) {
      throw new BadRequestException(
        'No Onboarding steps with the given id exist',
      );
    }

    const form = await this.formsService.findOne(createOnboardingDto.formId);

    const savedApiKey = await this.apiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    const cratedOnboarding = this.onboardingRepository.create({
      name: createOnboardingDto.name,
      steps: onboardingSteps,
      form,
      createdBy: savedApiKey,
    });

    const savedOnboarding =
      await this.onboardingRepository.save(cratedOnboarding);

    return mapOnboardingEntityToDto(savedOnboarding);
  }

  async findAll() {
    const allOnboardings = await this.onboardingRepository.find();
    return mapOnboardingsToDtos(allOnboardings);
  }

  async findAllById(onboardingIds: string[]) {
    const allOnboardingsById = await this.onboardingRepository.findBy({
      id: In(onboardingIds),
    });

    return mapOnboardingsToDtos(allOnboardingsById);
  }

  async findOne(id: string) {
    const onboarding = await this.onboardingRepository.findOne({
      where: { id },
      relations: { steps: true, form: true },
    });

    if (!onboarding) {
      throw new NotFoundException('Onboarding was not found');
    }

    return mapOnboardingEntityToDto(onboarding);
  }

  async update(
    headerApiKey: string,
    id: string,
    updateOnboardingDto: UpdateOnboardingDto,
  ) {
    const onboarding = await this.findOne(id);
    const savedApiKey = await this.apiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    Object.assign(onboarding, {
      name: updateOnboardingDto.name || onboarding.name,
      updatedBy: savedApiKey,
    });

    if (updateOnboardingDto.stepIds) {
      const onboardingSteps = await this.onboardingStepsService.findAllById(
        updateOnboardingDto.stepIds,
      );

      if (!onboardingSteps.length) {
        throw new BadRequestException(
          'No Onboarding steps with the given id exist',
        );
      }

      const updatedOnboardingSteps = removeDuplicateObjects(
        [...onboarding.steps, ...onboardingSteps],
        'id',
      );

      Object.assign(onboarding, {
        steps: updatedOnboardingSteps,
      });
    }

    if (updateOnboardingDto.formId) {
      const form = await this.formsService.findOne(updateOnboardingDto.formId);

      Object.assign(onboarding, {
        form,
      });
    }

    const updatedEntity = await this.onboardingRepository.save(onboarding);

    return mapOnboardingEntityToDto(updatedEntity);
  }

  async remove(id: string) {
    const onboarding = await this.onboardingRepository.findOne({
      where: { id },
    });

    if (!onboarding) {
      throw new NotFoundException('Onboarding was not found');
    }

    const removedEntity = await this.onboardingRepository.remove(onboarding);
    return mapOnboardingEntityToDto(removedEntity);
  }
}
