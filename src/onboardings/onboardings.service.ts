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

@Injectable()
export class OnboardingsService {
  constructor(
    private readonly onboardingStepsService: OnboardingStepsService,
    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,
  ) {}

  async create(createOnboardingDto: CreateOnboardingDto) {
    const onboardingSteps = await this.onboardingStepsService.findAllById(
      createOnboardingDto.stepIds,
    );

    if (!onboardingSteps.length) {
      throw new BadRequestException(
        'No Onboarding steps with the given id exist',
      );
    }

    const cratedOnboarding = this.onboardingRepository.create({
      name: createOnboardingDto.name,
      steps: onboardingSteps,
    });

    return await this.onboardingRepository.save(cratedOnboarding);
  }

  async findAll() {
    return await this.onboardingRepository.find({
      relations: {
        steps: true,
      },
    });
  }

  async findAllById(onboardingIds: string[]) {
    return await this.onboardingRepository.findBy({
      id: In(onboardingIds),
    });
  }

  async findOne(id: string) {
    if (!id) {
      return null;
    }

    const onboarding = await this.onboardingRepository.findOne({
      where: { id },
      relations: { steps: true },
    });

    if (!onboarding) {
      throw new NotFoundException('Onboarding was not found');
    }

    return onboarding;
  }

  async update(id: string, updateOnboardingDto: UpdateOnboardingDto) {
    const onboarding = await this.findOne(id);

    Object.assign(onboarding, {
      name: updateOnboardingDto.name || onboarding.name,
    });

    if (updateOnboardingDto.stepIds) {
      const onboardingSteps = await this.onboardingStepsService.findAllById(
        updateOnboardingDto.stepIds,
      );

      const updatedOnboardingSteps = removeDuplicateObjects(
        [...onboarding.steps, ...onboardingSteps],
        'id',
      );

      Object.assign(onboarding, {
        steps: updatedOnboardingSteps,
      });
    }

    return await this.onboardingRepository.save(onboarding);
  }

  async remove(id: string) {
    const onboarding = await this.findOne(id);

    return await this.onboardingRepository.remove(onboarding);
  }
}
