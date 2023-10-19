import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OnboardingStep } from 'src/onboardingSteps/entities/onboarding-step.entity';

@Entity()
export class Onboarding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(
    () => OnboardingStep,
    (onboardingStep) => onboardingStep.onboardings,
    {
      cascade: true,
      onDelete: 'NO ACTION',
    },
  )
  @JoinTable()
  steps: OnboardingStep[];
}
