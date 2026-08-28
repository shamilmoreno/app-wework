import { DeleteResult, getManager, In } from 'typeorm';
import { Subcategory } from '../../database/entities/subcategory';

export class SubcategoryService {
	public async getOne(subcategoryId: number): Promise<Subcategory> {
		return await getManager().getRepository(Subcategory).findOne({
			relations: ['category'],
			where: { id: subcategoryId },
		});
	}

	public async getByIds(subcategoryIds: string[]): Promise<Subcategory[]> {
		return await getManager().getRepository(Subcategory).find({
			relations: ['category'],
			where: { id: In(subcategoryIds) },
		});
	}

	public async getOneByName(subcategoryName: string): Promise<Subcategory> {
		return await getManager().getRepository(Subcategory).findOne({
			relations: ['category'],
			where: { name: subcategoryName },
		});
	}

	public async saveChanges(subcategory: Subcategory): Promise<Subcategory> {
		return await getManager().getRepository(Subcategory).save(subcategory);
	}

	public async remove(subcategoryId: number): Promise<DeleteResult> {
		return await getManager().getRepository(Subcategory).delete(subcategoryId);
	}
}
