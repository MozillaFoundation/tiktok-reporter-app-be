import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Study {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @AfterInsert()
  logAfterInsert() {
    console.log(`New study with id ${this.id} has been inserted.`);
  }

  @AfterUpdate()
  logAfterUpdate() {
    console.log(`New study with id ${this.id} has been updated.`);
  }

  @AfterRemove()
  logAfterRemove() {
    console.log(`New study with id ${this.id} has been removed.`);
  }
}
