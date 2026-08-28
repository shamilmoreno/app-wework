import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { Role } from './role';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  public id: number;

  // Relations
  @ManyToOne(() => User, user => user.userRoles, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Role, role => role.userRoles, { onDelete: 'SET NULL' })
  role: Role;
}
