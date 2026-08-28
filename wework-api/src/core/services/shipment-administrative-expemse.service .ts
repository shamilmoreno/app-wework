import { DeleteResult, getManager, InsertResult } from 'typeorm';
import { ShipmenAdministrativeExpense } from '../../database/entities/shipment-administrative-expense';

export class ShipmentAdministrativeExpenseService {
  public async listByShipmenttId(shipmentId: number): Promise<ShipmenAdministrativeExpense[]> {
    return await getManager().getRepository(ShipmenAdministrativeExpense).find({
      where: { shipment: { id: shipmentId } },
      order: { id: 'DESC' },
    });
  }

  public async saveChanges(shipmentExpense: ShipmenAdministrativeExpense[]): Promise<InsertResult> {
    return await getManager().createQueryBuilder().insert().into(ShipmenAdministrativeExpense).values(shipmentExpense).execute();
  }

  public async remove(shipmentId: number): Promise<DeleteResult> {
    return await getManager().getRepository(ShipmenAdministrativeExpense).delete({ shipment: { id: shipmentId } });
  }
}
