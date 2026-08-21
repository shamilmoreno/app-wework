import { DeleteResult, getManager } from 'typeorm';
import { Inventory } from '../../database/entities/inventory';

export class InventoryStockService {
	public async list(): Promise<Inventory[]> {
		return await getManager().getRepository(Inventory).find({
			relations: ['product', 'product.unitMeasurec'],
			order: { id: 'ASC' },
		});
	}

	public async getOne(inventoryStockId: number): Promise<Inventory> {
		return await getManager().getRepository(Inventory).findOne({
			where: { id: inventoryStockId },
			relations: ['product', 'product.unitMeasurec'],
			order: { id: 'DESC' },
		});
	}

	public async getOneByProductId(productId: any): Promise<Inventory> {
		return await getManager().getRepository(Inventory).findOne({
			where: { product: { id: productId, isActive: true } },
			relations: ['product', 'product.unitMeasurec'],
			order: { id: 'DESC' },
		});
	}

	public async getOneForDetail(inventoryStockId: number): Promise<Inventory> {
		return await getManager().getRepository(Inventory).findOne({
			where: { id: inventoryStockId },
			relations: ['product', 'product.unitMeasurec'],
			order: { id: 'DESC' },
		});
	}

	public async update(inventoryStock: Inventory): Promise<Inventory> {
		return await getManager().getRepository(Inventory).save(inventoryStock);
	}

	public async saveChanges(inventoryStock: Inventory): Promise<Inventory> {
		return await getManager().getRepository(Inventory).save(inventoryStock);
	}

	public async remove(inventoryStockId: number): Promise<DeleteResult> {
		return await getManager().getRepository(Inventory).delete({ inventoryMovements: { id: inventoryStockId } });
	}
}
