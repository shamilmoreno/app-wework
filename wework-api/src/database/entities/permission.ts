import { Trim } from 'class-sanitizer';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RolePermission } from './role.permission';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 1000 })
  @MaxLength(20, { message: 'El campo <comentario> es demasiado largo' })
  @MinLength(3, { message: 'El campo <comentario> es demasiado corto' })
  @Trim()
  public name: string;

  @Column({ default: false })
  public isActive: boolean;

  @Column({ type: 'date' })
  public createdAt: string;

  @OneToMany(() => RolePermission, rolePermission => rolePermission.permission)
  rolePermission = RolePermission[];
}
