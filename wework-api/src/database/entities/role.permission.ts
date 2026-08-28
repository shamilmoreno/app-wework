import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role';
import { Permission } from './permission';

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  public id: number;

  // Relations
  @ManyToOne(
    () => Role,
    (role: Role) => role.permissions,
    { onDelete: 'SET NULL' })
  public role: Role;

  @ManyToOne(
    () => Permission,
    (permission: Permission) => permission.roles,
    { onDelete: 'SET NULL' })
  public permission: Permission;
}
