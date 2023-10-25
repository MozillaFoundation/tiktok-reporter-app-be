import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { ApiKey } from 'src/auth/entities/api-key.entity';

@Entity()
export class OnboardingStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  details: string;

  @Column()
  order: number;

  @ManyToMany(() => Onboarding, (onboarding) => onboarding.steps, {
    onDelete: 'NO ACTION',
  })
  onboardings: Onboarding[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ApiKey)
  createdBy: ApiKey;

  @ManyToOne(() => ApiKey)
  updatedBy: ApiKey;
}
