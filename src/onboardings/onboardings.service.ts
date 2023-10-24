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

@Injectable()
export class OnboardingsService {
  constructor(
    private readonly onboardingStepsService: OnboardingStepsService,
    private readonly formsService: FormsService,
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

    const form = await this.formsService.findOne(createOnboardingDto.formId);

    const cratedOnboarding = this.onboardingRepository.create({
      name: createOnboardingDto.name,
      steps: onboardingSteps,
      form,
    });

    return await this.onboardingRepository.save(cratedOnboarding);
  }

  async findAll() {
    return await this.onboardingRepository.find({
      relations: {
        steps: true,
        form: true,
      },
    });
  }

  async findAllById(onboardingIds: string[]) {
    return await this.onboardingRepository.findBy({
      id: In(onboardingIds),
    });
  }

  async findOne(id: string) {
    const onboarding = await this.onboardingRepository.findOne({
      where: { id },
      relations: { steps: true, form: true },
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

    return await this.onboardingRepository.save(onboarding);
  }

  async remove(id: string) {
    const onboarding = await this.findOne(id);

    return await this.onboardingRepository.remove(onboarding);
  }
}
