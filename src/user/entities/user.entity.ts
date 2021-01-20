import { hashPassword } from 'src/utils/password.util';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender, Role } from '../enums';

@Entity(User.name)
export class User {
  @ObjectIdColumn() id: ObjectID;
  @Column() name: string;
  @Column() lastName: string;
  @Column() email: string;
  @Column() dob: Date;
  @Column() gender: Gender;
  @Column() role: Role;
  @Column() mobile: string;
  @Column({ length: 128, nullable: false, select: false }) password: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) this.password = hashPassword(this.password);
  }
}
