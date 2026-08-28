import { getManager } from 'typeorm';
import { Category } from '../../database/entities/category';

export class CategoryService {
	public async list(): Promise<Category[]> {
		return await getManager().getRepository(Category).find({
			relations: ['subcategories'],
			order: { id: 'DESC' },
		});
	}

	public async getOne(catId: number): Promise<Category> {
		return await getManager().getRepository(Category).findOne({ where: {id: catId} });
	}

	public async getOneWithSubcategories(catId: number): Promise<Category> {
		return await getManager().getRepository(Category).findOne({
			relations: ['subcategories'],
			where: { id: catId },
		});
	}

	public async getOneByNemWithSubcategories(catNem: string): Promise<Category> {
		return await getManager().getRepository(Category).findOne({
			relations: ['subcategories'],
			where: { nem: catNem },
		});
	}
}
