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

  @OneToMany(() => Onboarding, (onboarding) => onboarding.form, {
    cascade: false,
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  onboardings: Onboarding[];

  @OneToMany(() => Study, (study) => study.form, {
    cascade: false,
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  studies: Study[];

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
