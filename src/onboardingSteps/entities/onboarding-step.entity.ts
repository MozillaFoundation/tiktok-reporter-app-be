import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiKey } from 'src/auth/entities/api-key.entity';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';

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
    cascade: false,
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  onboardings: Onboarding[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ApiKey, {
    cascade: false,
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  createdBy: ApiKey;

  @ManyToOne(() => ApiKey, {
    cascade: false,
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  updatedBy: ApiKey;
}
