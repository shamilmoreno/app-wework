import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { Role } from './role';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  public id: number;

  // Relations
  @ManyToOne(
    () => User,
    (user: User) => user.roles,
    { onDelete: 'CASCADE' })
  public user: User;

  @ManyToOne(
    () => Role,
    (role: Role) => role.userRoles,
    { onDelete: 'SET NULL' })
  public role: Role;
}
