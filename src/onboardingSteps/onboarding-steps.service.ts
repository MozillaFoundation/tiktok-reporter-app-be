import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OnboardingStep } from './entities/onboarding-step.entity';
import { CreateOnboardingStepDto } from './dtos/create-onboarding-step.dto';
import { UpdateOnboardingStepDto } from './dtos/update-onboarding-step.dto';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import {
  mapOnboardingStepEntityToDto,
  mapOnboardingStepsToDtos,
} from './mappers/mapEntitiesToDto';

@Injectable()
export class OnboardingStepsService {
  constructor(
    @InjectRepository(OnboardingStep)
    private readonly onboardingStepRepository: Repository<OnboardingStep>,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  async create(
    headerApiKey: string,
    createOnboardingStepDto: CreateOnboardingStepDto,
  ) {
    const savedApiKey = await this.apiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    const createdCountryCode = this.onboardingStepRepository.create({
      title: createOnboardingStepDto.title,
      platform: createOnboardingStepDto.platform,
      subtitle: createOnboardingStepDto.subtitle,
      description: createOnboardingStepDto.description,
      imageUrl: createOnboardingStepDto.imageUrl,
      details: createOnboardingStepDto.details,
      order: createOnboardingStepDto.order,
      createdBy: savedApiKey,
    });

    const savedOnboardingStep =
      await this.onboardingStepRepository.save(createdCountryCode);

    return mapOnboardingStepEntityToDto(savedOnboardingStep);
  }

  async findAll() {
    const allOnboardingSteps = await this.onboardingStepRepository.find();

    return mapOnboardingStepsToDtos(allOnboardingSteps);
  }

  async findAllById(onboardingStepIds: string[]) {
    const allOnboardingStepsById = await this.onboardingStepRepository.findBy({
      id: In(onboardingStepIds),
    });

    return mapOnboardingStepsToDtos(allOnboardingStepsById);
  }

  async findOne(id: string) {
    const onboardingStep = await this.onboardingStepRepository.findOneBy({
      id,
    });

    if (!onboardingStep) {
      throw new NotFoundException('Onboarding step was not found');
    }

    return mapOnboardingStepEntityToDto(onboardingStep);
  }

  async update(
    headerApiKey: string,
    id: string,
    updateCountryCodeDto: UpdateOnboardingStepDto,
  ) {
    const onboardingStep = await this.findOne(id);
    const savedApiKey = await this.apiKeyRepository.findOne({
      where: { key: headerApiKey },
    });

    Object.assign(onboardingStep, {
      title: updateCountryCodeDto.title || onboardingStep.title,
      platform: updateCountryCodeDto.platform || onboardingStep.platform,
      subtitle: updateCountryCodeDto.subtitle || onboardingStep.subtitle,
      description:
        updateCountryCodeDto.description || onboardingStep.description,
      imageUrl: updateCountryCodeDto.imageUrl || onboardingStep.imageUrl,
      details: updateCountryCodeDto.details || onboardingStep.details,
      order: updateCountryCodeDto.order || onboardingStep.order,
      updatedBy: savedApiKey,
    });

    const updatedStep =
      await this.onboardingStepRepository.save(onboardingStep);

    return mapOnboardingStepEntityToDto(updatedStep);
  }

  async remove(id: string) {
    const onboardingStep = await this.onboardingStepRepository.findOneBy({
      id,
    });

    if (!onboardingStep) {
      throw new NotFoundException('Onboarding step was not found');
    }

    const removedOnboardingStep =
      await this.onboardingStepRepository.remove(onboardingStep);

    return mapOnboardingStepEntityToDto(removedOnboardingStep);
  }
}
