import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CountryCode } from 'src/countryCodes/entities/country-code.entity';

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

  // studies/:cc
  // // Create a connection to countrycode table
  // @Column()
  // countryCodeId: number;

  // studies/:id/onboard
  // class Onboard:{
  // Many to many OnboardSteps
  // steps:{id, title?, description, imageUrl, details, order, onboardForm:Form}
  // }

  // termsandconditions
  // title, subtitle, text

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
