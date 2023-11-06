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
import { Study } from 'src/studies/entities/study.entity';

@Entity()
export class CountryCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  countryName: string;

  @Column()
  code: string;

  @ManyToMany(() => Study, (study) => study.countryCodes, {
    cascade: false,
    onDelete: 'SET NULL',
  })
  studies: Study[];

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
