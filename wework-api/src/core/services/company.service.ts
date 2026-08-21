import { DeleteResult, getManager } from 'typeorm';
import { Company } from '../../database/entities/company';

export class CompanyService {
	public async list(): Promise<Company[]> {
		return await getManager().getRepository(Company).find();
	}

	public async getOne(companyId: number): Promise<Company> {
		return await getManager().getRepository(Company).findOne({
			where: { id: companyId },
		});
	}

	public async saveChanges(company: Company): Promise<Company> {
		return await getManager().getRepository(Company).save(company);
	}

	public async remove(companyId: number): Promise<DeleteResult> {
		return await getManager().getRepository(Company).delete(companyId);
	}

	public async update(company: Company): Promise<Company> {
		return await getManager().getRepository(Company).save(company);
	}
}
