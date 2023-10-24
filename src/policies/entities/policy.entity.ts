import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PolicyType } from 'src/types/policy.type';
import { Study } from 'src/studies/entities/study.entity';

@Entity()
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PolicyType,
    default: PolicyType.TermsOfService,
  })
  type: PolicyType;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  text: string;

  @ManyToMany(() => Study, (study) => study.policies, {
    onDelete: 'NO ACTION',
  })
  studies: Study[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
