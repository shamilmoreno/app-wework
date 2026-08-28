import { Between, DeleteResult, getManager } from 'typeorm';
import { Provider } from '../../database/entities/provider';

export class ProviderService {
	public async list(): Promise<Provider[]> {
		return await getManager().getRepository(Provider).find({
			order: { id: 'DESC' },
		});
	}

	public async listAct(): Promise<Provider[]> {
		return await getManager().getRepository(Provider).find({
			order: { id: 'DESC' },
		});
	}

	public async getByDateFilter(init: string, end: string): Promise<[Provider[], number]> {
		return await getManager().getRepository(Provider).findAndCount({ where: { createdAt: Between(init, end) } });
	}

	public async getOne(providerId: number): Promise<Provider> {
		return await getManager().getRepository(Provider).findOne({
			where: { id: providerId },
		});
	}

	public async getOneForDataValidation(dvRifNumber: number): Promise<Provider> {
		return await getManager().getRepository(Provider).findOne({});
	}

	public async getOneForDetail(providerId: number): Promise<Provider> {
		return await getManager().getRepository(Provider).findOne({
			where: { id: providerId },
		});
	}

	public async saveChanges(provider: Provider): Promise<Provider> {
		return await getManager().getRepository(Provider).save(provider);
	}

	public async remove(providerId: number): Promise<DeleteResult> {
		return await getManager().getRepository(Provider).delete(providerId);
	}
}
