import { DeleteResult, getManager, InsertResult } from 'typeorm';
import {ShipmenNationalizationExpense } from '../../database/entities/shipment-nationalization-expense';

export class ShipmentNationalizationExpenseService {
  public async listByShipmenttId(shipmentId: number): Promise<ShipmenNationalizationExpense[]> {
    return await getManager().getRepository(ShipmenNationalizationExpense).find({
      where: { shipment: { id: shipmentId } },
      order: { id: 'DESC' },
    });
  }

  public async saveChanges(shipmentExpense: ShipmenNationalizationExpense[]): Promise<InsertResult> {
    return await getManager().createQueryBuilder().insert().into(ShipmenNationalizationExpense).values(shipmentExpense).execute();
  }

  public async remove(shipmentId: number): Promise<DeleteResult> {
    return await getManager().getRepository(ShipmenNationalizationExpense).delete({ shipment: { id: shipmentId } });
  }
}
