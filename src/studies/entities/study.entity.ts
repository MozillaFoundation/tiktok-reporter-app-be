import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { Policy } from 'src/policies/entities/policy.entity';

@Entity()
export class Study {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

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

  // studies/:id/onboard
  // class Onboard:{
  // Many to many OnboardSteps
  // steps:{id, title?, description, imageUrl, details, order},
  // onboardForm:Form
  // }

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
