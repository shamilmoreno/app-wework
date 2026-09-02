import { getManager } from "typeorm";
import { RolePermission } from "../../database/entities/role.permission";

export class RolePermissionService {
	// Trae todos los permisos activos asignados a un rol
	public async getPermissionsByRole(roleId: number): Promise<RolePermission[]> {
		return await getManager()
			.getRepository(RolePermission)
			.find({
				where: { role: { id: roleId } },
				relations: ["permission"],
			});
	}

	// Reemplaza TODOS los permisos de un rol de una sola vez
	// (ideal para el panel del Admin: manda el arreglo completo de checkboxes marcados)
	public async setPermissionsForRole(roleId: number, permissionIds: number[]): Promise<void> {
		const repo = getManager().getRepository(RolePermission);

		// 1. Borra las asignaciones actuales de ese rol
		await repo.delete({ role: { id: roleId } });

		// 2. Si no seleccionó ningún permiso, no hay nada más que hacer
		if (!permissionIds.length) return;

		// 3. Crea las nuevas asignaciones
		const newAssignments = permissionIds.map((permissionId) =>
			repo.create({
				role: { id: roleId } as any,
				permission: { id: permissionId } as any,
			}),
		);

		await repo.save(newAssignments);
	}
}
