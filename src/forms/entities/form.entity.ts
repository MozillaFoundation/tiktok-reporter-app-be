import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DropDownField } from 'src/forms/types/fields/drop-down.field';
import { SliderField } from 'src/forms/types/fields/slider.field';
import { TextField } from 'src/forms/types/fields/text.field';

@Entity()
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('jsonb', { nullable: false, default: {} })
  fields: Array<TextField | DropDownField | SliderField>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
