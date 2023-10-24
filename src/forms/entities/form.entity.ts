import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DropDownField } from 'src/forms/types/fields/drop-down.field';
import { SliderField } from 'src/forms/types/fields/slider.field';
import { TextField } from 'src/forms/types/fields/text.field';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { Study } from 'src/studies/entities/study.entity';

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
}
