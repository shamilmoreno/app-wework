import { DeleteResult, getManager } from "typeorm";
import { Permission } from "../../database/entities/permission";

export class PermissionService {
	public async list(): Promise<Permission[]> {
		return await getManager()
			.getRepository(Permission)
			.find({
				order: { id: "DESC" },
			});
	}

	public async listActive(): Promise<Permission[]> {
		return await getManager()
			.getRepository(Permission)
			.find({
				where: { isActive: true },
				order: { name: "ASC" },
			});
	}

	public async getOne(permissionId: number): Promise<Permission> {
		return await getManager()
			.getRepository(Permission)
			.findOne({
				where: { id: permissionId },
			});
	}

	public async saveChanges(permission: Permission): Promise<Permission> {
		return await getManager().getRepository(Permission).save(permission);
	}

	public async remove(permissionId: number): Promise<DeleteResult> {
		return await getManager().getRepository(Permission).delete(permissionId);
	}
}
