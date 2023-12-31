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

// This cannot be moved to a separate file because of typeorm migrations constraint for enums
export enum PolicyType {
  TermsOfService = 'TermsOfService',
  PrivacyPolicy = 'PrivacyPolicy',
}

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
    cascade: false,
    onDelete: 'SET NULL',
  })
  studies: Study[];

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
