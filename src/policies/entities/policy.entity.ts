import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { PolicyType } from 'src/models/policyType';

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
}
