import { Between, DeleteResult, getManager } from "typeorm";
import { Role } from "../../database/entities/role";

export class RoleService {
	public async list(): Promise<Role[]> {
		return await getManager()
			.getRepository(Role)
			.find({
				order: { id: "DESC" },
			});
	}

	public async listAct(): Promise<Role[]> {
		return await getManager()
			.getRepository(Role)
			.find({
				order: { id: "DESC" },
			});
	}

	public async getByDateFilter(init: string, end: string): Promise<[Role[], number]> {
		return await getManager()
			.getRepository(Role)
			.findAndCount({ where: { createdAt: Between(init, end) } });
	}

	public async getOne(roleId: number): Promise<Role> {
		return await getManager()
			.getRepository(Role)
			.findOne({
				where: { id: roleId },
			});
	}

	public async getOneForDataValidation(dvRifNumber: number): Promise<Role> {
		return await getManager().getRepository(Role).findOne({});
	}

	public async getOneForDetail(roleId: number): Promise<Role> {
		return await getManager()
			.getRepository(Role)
			.findOne({
				where: { id: roleId },
			});
	}

	public async saveChanges(role: Role): Promise<Role> {
		return await getManager().getRepository(Role).save(role);
	}

	public async remove(roleId: number): Promise<DeleteResult> {
		return await getManager().getRepository(Role).delete(roleId);
	}
}
