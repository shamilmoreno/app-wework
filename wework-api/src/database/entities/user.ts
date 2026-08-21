import * as bcrypt from 'bcrypt';
import { Trim } from 'class-sanitizer';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subcategory } from './subcategory';
import { UserRole } from './user.role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 20 })
  @MaxLength(20, { message: 'El campo <firstName> es demasiado largo' })
  @MinLength(3, { message: 'El campo <firstName> es demasiado corto' })
  @Trim()
  public firstName: string;

  @Column({ length: 20 })
  @MaxLength(20, { message: 'El campo <lastName> es demasiado largo' })
  @MinLength(3, { message: 'El campo <lastName> es demasiado corto' })
  @Trim()
  public lastName: string;

  @Column({ unique: true })
  @IsEmail()
  public email: string;

  @Column()
  public password: string;

  @Column({ nullable: true })
  public token: string;

  @Column({ type: 'date' })
  public createdAt: string;

  // RELATIONS
  @OneToMany(
    () => UserRole,
    (userRole: UserRole) => userRole.user)
  public roles: UserRole[];

  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public gender: Subcategory;

  // Methods
  public hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
