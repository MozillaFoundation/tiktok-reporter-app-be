import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiKey } from 'src/auth/entities/api-key.entity';
import { Form } from 'src/forms/entities/form.entity';
import { OnboardingStep } from 'src/onboardingSteps/entities/onboarding-step.entity';
import { Study } from 'src/studies/entities/study.entity';

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
      onDelete: 'SET NULL',
    },
  )
  @JoinTable()
  steps: OnboardingStep[];

  @OneToMany(() => Study, (study) => study.onboarding)
  studies: Study[];

  @ManyToOne(() => Form, (form) => form.onboardings)
  form: Form;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ApiKey)
  createdBy: ApiKey;

  @ManyToOne(() => ApiKey)
  updatedBy: ApiKey;
}
