import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Onboarding } from 'src/onboardings/entities/onboarding.entity';

@Entity()
export class OnboardingStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

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
}
