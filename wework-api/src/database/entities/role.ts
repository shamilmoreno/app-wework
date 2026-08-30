import { Trim } from "class-sanitizer";
import { MaxLength, MinLength } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./user.role";
import { RolePermission } from './role.permission';

@Entity()
export class Role {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ length: 1000 })
	@MaxLength(20, { message: "El campo <comentario> es demasiado largo" })
	@MinLength(3, { message: "El campo <comentario> es demasiado corto" })
	@Trim()
	public name: string;

	@Column({ type: "date" })
	public createdAt: string;

	// RELATIONS
	@OneToMany(() => UserRole, (userRole) => userRole.role)
	userRoles: UserRole[];

	@OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
	rolePermissions: RolePermission[];
}
