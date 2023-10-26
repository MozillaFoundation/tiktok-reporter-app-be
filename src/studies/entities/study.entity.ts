import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiKey } from 'src/auth/entities/api-key.entity';
import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { Form } from 'src/forms/entities/form.entity';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { Policy } from 'src/policies/entities/policy.entity';

@Entity()
export class Study {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  isActive: boolean;

  @ManyToMany(() => CountryCode, (countryCode) => countryCode.studies, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinTable()
  countryCodes: CountryCode[];

  @ManyToMany(() => Policy, (policy) => policy.studies, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinTable()
  policies: Policy[];

  @ManyToOne(() => Onboarding, (onboarding) => onboarding.studies)
  onboarding: Onboarding;

  @ManyToOne(() => Form, (form) => form.studies)
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
