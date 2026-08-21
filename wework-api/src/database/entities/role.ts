import { Trim } from 'class-sanitizer';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { Permission } from './permission';
import { UserRole } from './user.role';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 1000 })
  @MaxLength(20, { message: 'El campo <comentario> es demasiado largo' })
  @MinLength(3, { message: 'El campo <comentario> es demasiado corto' })
  @Trim()
  public name: string;

  @Column({ type: 'date' })
  public createdAt: string;

  // RELATIONS
  @ManyToMany(
    () => UserRole,
    (userRole: UserRole) => userRole.role)
  public userRoles: UserRole[];

  @ManyToMany(
    () => Permission,
    (permission: Permission) => permission.roles)
  public permissions: Permission[];
}
