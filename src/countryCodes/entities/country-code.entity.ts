import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Study } from 'src/studies/entities/study.entity';
import { ApiKey } from 'src/auth/entities/api-key.entity';

@Entity()
export class CountryCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  countryName: string;

  @Column()
  code: string;

  @ManyToMany(() => Study, (study) => study.countryCodes, {
    onDelete: 'NO ACTION',
  })
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
