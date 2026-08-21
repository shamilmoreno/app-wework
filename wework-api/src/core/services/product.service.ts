import { Between, DeleteResult, getManager } from 'typeorm';
import { Product } from '../../database/entities/product';

export class ProductService {
	public async list(): Promise<Product[]> {
		return await getManager().getRepository(Product).find({
			where: { isActive: true },
			relations: ['unitMeasurec', 'stock'],
			order: { name: 'ASC' },
		});
	}

	public async getOne(productId: number): Promise<Product> {
		return await getManager().getRepository(Product).findOne({
			where: { id: productId, isActive: true },
			relations: ['unitMeasurec', 'stock'],
			order: { name: 'ASC' },
		});
	}

	public async getOneForDetail(productId: number): Promise<Product> {
		return await getManager().getRepository(Product).findOne({
			relations: ['unitMeasurec', 'stock'],
			where: { id: productId, isActive: true },
			order: { name: 'DESC' },
		});
	}

	public async getByDateFilter(init: string, end: string): Promise<Product[]> {
		return await getManager().getRepository(Product).find({
			where: {
				createdAt: Between(init, end),
				isActive: true
			},
			relations: ['unitMeasurec', 'stock'],
		});
	}

	public async getOneOnlyObject(productId: number): Promise<Product> {
		return await getManager().getRepository(Product).findOne({ where: { id: productId } });
	}

	public async saveChanges(product: Product): Promise<Product> {
		return await getManager().getRepository(Product).save(product);
	}

	public async remove(productId: number): Promise<DeleteResult> {
		return await getManager().getRepository(Product).delete(productId);
	}

	public async update(product: Product): Promise<Product> {
		return await getManager().getRepository(Product).save(product);
	}
}
