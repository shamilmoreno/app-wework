import { DeleteResult, getManager, In } from "typeorm";
import { WareHouse } from "../../database/entities/warehouse ";

export class WareHouseService {
	public async list(): Promise<WareHouse[]> {
		return await getManager()
			.getRepository(WareHouse)
			.find({
				order: { id: "DESC" },
			});
	}

	public async listByIds(warehouseIds: number[]): Promise<WareHouse[]> {
		return await getManager()
			.getRepository(WareHouse)
			.find({
				where: { id: In(warehouseIds) },
			});
	}

	public async getOne(wareHouseId: number): Promise<WareHouse> {
		return await getManager()
			.getRepository(WareHouse)
			.findOne({ where: { id: wareHouseId } });
	}

	public async update(wareHouse: WareHouse): Promise<WareHouse> {
		return await getManager().getRepository(WareHouse).save(wareHouse);
	}

	public async saveChanges(wareHouse: WareHouse): Promise<WareHouse> {
		return await getManager().getRepository(WareHouse).save(wareHouse);
	}

	public async remove(wareHouseId: number): Promise<DeleteResult> {
		return await getManager().getRepository(WareHouse).delete(wareHouseId);
	}
}
