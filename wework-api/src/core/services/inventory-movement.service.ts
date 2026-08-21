import { Between, DeleteResult, getManager } from 'typeorm';
import { Inventory } from '../../database/entities/inventory';
import { InventoryMovement } from "../../database/entities/inventory-movement";

export class InventoryMovementService {
	public async list(): Promise<InventoryMovement[]> {
		return await getManager().getRepository(InventoryMovement).find({
			relations: ['inventoryStock.product'],
			order: { id: 'ASC' },
		});
	}

	public async getOne(inventoryId: number): Promise<InventoryMovement> {
		return await getManager().getRepository(InventoryMovement).findOne({
			where: { id: inventoryId },
			relations: ['maquiladorBag', 'products', 'products.product', 'payments'],
			order: { id: 'DESC' },
		});
	}

	public async getOneForDetail(inventoryId: number): Promise<InventoryMovement[]> {
		return await getManager().getRepository(InventoryMovement).find({
			where: { inventoryStock: { id: inventoryId}, },
			order: { id: 'DESC' },
		});
	}

	public async getByDateFilter(init: string, end: string): Promise<InventoryMovement[]> {
		return await getManager().getRepository(InventoryMovement).find({
			where: {
				createdAt: Between(init, end),
			},
			relations: ['maquiladorBag', 'products', 'products.product', 'payments'],
		});
	}

	public async getOneOnlyObject(inventoryId: number): Promise<InventoryMovement> {
		return await getManager().getRepository(InventoryMovement).findOne({ where: { id: inventoryId } });
	}

	public async saveChanges(inventoryMovement: InventoryMovement): Promise<InventoryMovement> {
		return await getManager().getRepository(InventoryMovement).save(inventoryMovement);
	}

	public async remove(inventoryId: number): Promise<DeleteResult> {
		return await getManager().getRepository(Inventory).delete(inventoryId);
	}
}
