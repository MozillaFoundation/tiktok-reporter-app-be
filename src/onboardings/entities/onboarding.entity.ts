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
      cascade: false,
      onDelete: 'SET NULL',
    },
  )
  @JoinTable()
  steps: OnboardingStep[];

  @OneToMany(() => Study, (study) => study.onboarding, {
    cascade: false,
    onDelete: 'SET NULL',
  })
  studies: Study[];

  @ManyToOne(() => Form, (form) => form.onboardings, {
    cascade: false,
    onDelete: 'SET NULL',
  })
  form: Form;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ApiKey, {
    cascade: false,
    onDelete: 'SET NULL',
  })
  createdBy: ApiKey;

  @ManyToOne(() => ApiKey, {
    cascade: false,
    onDelete: 'SET NULL',
  })
  updatedBy: ApiKey;
}
