import { DeleteResult, getManager } from 'typeorm';
import { InventoryStock } from '../../database/entities/inventory-stock ';

export class InventoryStockService {
	public async list(): Promise<InventoryStock[]> {
		return await getManager().getRepository(InventoryStock).find({
			relations: ['product', 'product.unitMeasurec', 'warehouse'],
			order: { id: 'ASC' },
		});
	}

	public async getOne(inventoryStockId: number): Promise<InventoryStock> {
		return await getManager().getRepository(InventoryStock).findOne({
			where: { id: inventoryStockId },
			relations: ['product', 'product.unitMeasurec', 'warehouse'],
			order: { id: 'DESC' },
		});
	}

	public async getOneByProductId(productId: any): Promise<InventoryStock> {
		return await getManager().getRepository(InventoryStock).findOne({
			where: { product: { id: productId, isActive: true } },
			relations: ['product', 'product.unitMeasurec', 'warehouse'],
			order: { id: 'DESC' },
		});
	}

	public async getOneForDetail(inventoryStockId: number): Promise<InventoryStock> {
		return await getManager().getRepository(InventoryStock).findOne({
			where: { id: inventoryStockId },
			relations: ['product', 'product.unitMeasurec', 'warehouse'],
			order: { id: 'DESC' },
		});
	}

	public async update(inventoryStock: InventoryStock): Promise<InventoryStock> {
		return await getManager().getRepository(InventoryStock).save(inventoryStock);
	}

	public async saveChanges(inventoryStock: InventoryStock): Promise<InventoryStock> {
		return await getManager().getRepository(InventoryStock).save(inventoryStock);
	}

	public async remove(inventoryStockId: number): Promise<DeleteResult> {
		return await getManager().getRepository(InventoryStock).delete({ /* inventoryMovements: { id: inventoryStockId }  */});
	}
}
