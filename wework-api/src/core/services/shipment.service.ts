import { Between, DeleteResult, getManager, In } from 'typeorm';
import { Shipment } from '../../database/entities/shipment';

export class ShipmentService {
	public async list(): Promise<Shipment[]> {
		return await getManager().getRepository(Shipment).find({
			relations: ['provider', 'legalRegimes', 'legalRegimes.legalRegimes', 'entryPort', 'origin', 'brand', 'description', 'state', 'observations', 'administrativeExpenses', 'nationalizationExpenses'],
			order: { id: 'DESC' },
		});
	}

	public async listPendingShipments(values: any): Promise<Shipment[]> {
		return await getManager().getRepository(Shipment).find({
			relations: ['provider', 'legalRegimes', 'legalRegimes.legalRegimes', 'entryPort', 'origin', 'brand', 'description', 'state', 'observations', 'administrativeExpenses', 'nationalizationExpenses'],
			where: {
				state: In(values)
			}
		});
	}

	public async getOne(shipmentId: number): Promise<Shipment> {
		return await getManager().getRepository(Shipment).findOne({
			where: { id: shipmentId },
			relations: ['provider', 'legalRegimes', 'legalRegimes.legalRegimes', 'entryPort', 'origin', 'brand', 'description', 'state', 'observations', 'administrativeExpenses', 'nationalizationExpenses'],
			order: { id: 'DESC' }
		});
	}


	public async getOneForDetail(shipmentId: number): Promise<Shipment> {
		return await getManager().getRepository(Shipment).findOne({
			relations: ['provider', 'legalRegimes', 'legalRegimes.legalRegimes', 'entryPort', 'origin', 'brand', 'description', 'state', 'observations', 'administrativeExpenses', 'nationalizationExpenses'],
			where: { id: shipmentId },
		});
	}

	public async getByDateFilter(init: string, end: string): Promise<Shipment[]> {
		return await getManager().getRepository(Shipment).find({
			relations: ['provider', 'legalRegimes', 'legalRegimes.legalRegimes', 'entryPort', 'origin', 'brand', 'description', 'state', 'observations', 'administrativeExpenses', 'nationalizationExpenses'],
			where: {
				arrivalDate: Between(init, end)
			}
		});
	}

	public async getOneOnlyObject(shipmentId: number): Promise<Shipment> {
		return await getManager().getRepository(Shipment).findOne({ where: { id: shipmentId } });
	}

	public async saveChanges(shipment: Shipment): Promise<Shipment> {
		return await getManager().getRepository(Shipment).save(shipment);
	}

	public async remove(shipmentId: number): Promise<DeleteResult> {
		return await getManager().getRepository(Shipment).delete(shipmentId);
	}

	public async update(shipment: Shipment): Promise<Shipment> {
		return await getManager().getRepository(Shipment).save(shipment);
	}
}
