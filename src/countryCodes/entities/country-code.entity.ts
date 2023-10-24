import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
    onDelete: 'NO ACTION',
  })
  studies: Study[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
