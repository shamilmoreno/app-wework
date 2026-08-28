import { Between, DeleteResult, getManager } from 'typeorm';
import { InventoryStock } from '../../database/entities/inventory-stock ';
import { InventoryMovement } from "../../database/entities/inventory-movement";

export class InventoryMovementService {
	public async list(): Promise<InventoryMovement[]> {
		return await getManager().getRepository(InventoryMovement).find({
			relations: ['product', 'warehouse'],
			order: { id: 'ASC' },
		});
	}

	public async getOne(inventoryId: number): Promise<InventoryMovement> {
		return await getManager().getRepository(InventoryMovement).findOne({
			where: { id: inventoryId },
			relations: ['product', 'warehouse'],
			order: { id: 'DESC' },
		});
	}

	public async getOneForDetail(inventoryId: number): Promise<InventoryMovement[]> {
		return await getManager().getRepository(InventoryMovement).find({
			//where: { inventoryStock: { id: inventoryId}, },
			order: { id: 'DESC' },
		});
	}

	/* public async getByDateFilter(init: string, end: string): Promise<InventoryMovement[]> {
		return await getManager().getRepository(InventoryMovement).find({
			where: {
				createdAt: Between(init, end),
			},
			relations: ['maquiladorBag', 'products', 'products.product', 'payments'],
		});
	} */

	public async getOneOnlyObject(inventoryId: number): Promise<InventoryMovement> {
		return await getManager().getRepository(InventoryMovement).findOne({ where: { id: inventoryId } });
	}

	public async saveChanges(inventoryMovement: InventoryMovement): Promise<InventoryMovement> {
		return await getManager().getRepository(InventoryMovement).save(inventoryMovement);
	}

	public async remove(inventoryId: number): Promise<DeleteResult> {
		return await getManager().getRepository(InventoryMovement).delete(inventoryId);
	}
}
