import { Between, DeleteResult, getManager } from 'typeorm';
import { BagRecipe } from '../../database/entities/bag-recipe';

export class BagRecipeService {
	public async list(): Promise<BagRecipe[]> {
		return await getManager().getRepository(BagRecipe).find({
			where: { isActive: true },
			relations: ['maquiladors', 'maquiladors.company', 'payments', 'products', 'products.product'],
			order: { createdAt: 'DESC' }
		});
	}

	public async getOne(bagRecipeId: number): Promise<BagRecipe> {
		return await getManager().getRepository(BagRecipe).findOne({
			where: { id: bagRecipeId, isActive: true },
			relations: ['maquiladors', 'maquiladors.company', 'payments', 'products.product.stock'],
			order: { id: 'DESC' },
		});
	}

	public async getOneForDetail(bagRecipeId: number): Promise<BagRecipe> {
		return await getManager().getRepository(BagRecipe).findOne({
			where: { id: bagRecipeId, isActive: true },
			relations: ['maquiladors', 'maquiladors.company', 'payments', 'products', 'products.product.stock'],
			order: { createdAt: 'DESC' }
		});
	}

	public async getByDateFilter(init: string, end: string): Promise<BagRecipe[]> {
		return await getManager().getRepository(BagRecipe).find({
			where: {
				monthRecipeBag: Between(init, end),
				isActive: true
			},
			relations: ['maquiladors', 'maquiladors.company', 'payments', 'products', 'products.product.stock'],
		});
	}

	public async getOneOnlyObject(bagRecipeId: number): Promise<BagRecipe> {
		return await getManager().getRepository(BagRecipe).findOne({ where: { id: bagRecipeId } });
	}

	public async saveChanges(bagRecipe: BagRecipe): Promise<BagRecipe> {
		return await getManager().getRepository(BagRecipe).save(bagRecipe);
	}

	public async remove(bagRecipeId: number): Promise<DeleteResult> {
		return await getManager().getRepository(BagRecipe).delete(bagRecipeId);
	}

	public async update(bagRecipe: BagRecipe): Promise<BagRecipe> {
		return await getManager().getRepository(BagRecipe).save(bagRecipe);
	}
}
