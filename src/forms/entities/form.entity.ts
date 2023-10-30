import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiKey } from 'src/auth/entities/api-key.entity';
import { DropDownField } from 'src/forms/types/fields/drop-down.field';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { SliderField } from 'src/forms/types/fields/slider.field';
import { Study } from 'src/studies/entities/study.entity';
import { TextField } from 'src/forms/types/fields/text.field';

@Entity()
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('jsonb', { nullable: false, default: {} })
  fields: Array<TextField | DropDownField | SliderField>;

  @OneToMany(() => Onboarding, (onboarding) => onboarding.form)
  onboardings: Onboarding[];

  @OneToMany(() => Study, (study) => study.form)
  studies: Study[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ApiKey)
  createdBy: ApiKey;

  @ManyToOne(() => ApiKey)
  updatedBy: ApiKey;
}
