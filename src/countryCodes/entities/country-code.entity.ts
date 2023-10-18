import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Study } from 'src/studies/entities/study.entity';

@Entity()
export class CountryCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @ManyToMany(() => Study, (study) => study.countryCodes, {
    onDelete: 'NO ACTION',
  })
  studies: Study[];
}
