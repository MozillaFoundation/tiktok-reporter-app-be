import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OnboardingStep } from './entities/onboarding-step.entity';
import { CreateOnboardingStepDto } from './dtos/create-onboarding-step.dto';
import { UpdateOnboardingStepDto } from './dtos/update-onboarding-step.dto';

@Injectable()
export class OnboardingStepsService {
  constructor(
    @InjectRepository(OnboardingStep)
    private readonly onboardingStepRepository: Repository<OnboardingStep>,
  ) {}

  async create(createOnboardingStepDto: CreateOnboardingStepDto) {
    const createdCountryCode = this.onboardingStepRepository.create({
      title: createOnboardingStepDto.title,
      description: createOnboardingStepDto.description,
      imageUrl: createOnboardingStepDto.imageUrl,
      details: createOnboardingStepDto.details,
      order: createOnboardingStepDto.order,
    });

    return await this.onboardingStepRepository.save(createdCountryCode);
  }

  async findAll() {
    return await this.onboardingStepRepository.find();
  }

  async findAllById(onboardingStepIds: string[]) {
    return await this.onboardingStepRepository.findBy({
      id: In(onboardingStepIds),
    });
  }

  async findOne(id: string) {
    const onboardingStep = await this.onboardingStepRepository.findOneBy({
      id,
    });

    if (!onboardingStep) {
      throw new NotFoundException('Onboarding step was not found');
    }

    return onboardingStep;
  }

  async update(id: string, updateCountryCodeDto: UpdateOnboardingStepDto) {
    const onboardingStep = await this.findOne(id);

    Object.assign(onboardingStep, {
      title: updateCountryCodeDto.title || onboardingStep.title,
      description:
        updateCountryCodeDto.description || onboardingStep.description,
      imageUrl: updateCountryCodeDto.imageUrl || onboardingStep.imageUrl,
      details: updateCountryCodeDto.details || onboardingStep.details,
      order: updateCountryCodeDto.order || onboardingStep.order,
    });

    return await this.onboardingStepRepository.save(onboardingStep);
  }

  async remove(id: string) {
    const onboardingStep = await this.findOne(id);

    return await this.onboardingStepRepository.remove(onboardingStep);
  }
}
