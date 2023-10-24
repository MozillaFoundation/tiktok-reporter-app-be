import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { Policy } from 'src/policies/entities/policy.entity';

@Entity()
export class Study {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  isActive: boolean;

  @ManyToMany(() => CountryCode, (countryCode) => countryCode.studies, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinTable()
  countryCodes: CountryCode[];

  @ManyToMany(() => Policy, (policy) => policy.studies, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinTable()
  policies: Policy[];

  @ManyToOne(() => Onboarding, (onboarding) => onboarding.studies)
  onboarding: Onboarding;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Form:
  /* studies/id/form
  Form: 
    id
    Type: Recording, Reporting
    Title
    fields:{order}
  */

  // @AfterInsert()
  // logAfterInsert() {
  //   console.log(`New study with id ${this.id} has been inserted.`);
  // }

  // @AfterUpdate()
  // logAfterUpdate() {
  //   console.log(`New study with id ${this.id} has been updated.`);
  // }

  // @AfterRemove()
  // logAfterRemove() {
  //   console.log(`New study with id ${this.id} has been removed.`);
  // }
}
