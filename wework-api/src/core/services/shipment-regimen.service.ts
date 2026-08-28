import { DeleteResult, getConnection, getManager, InsertResult } from 'typeorm';
import { ShipmentRegime } from '../../database/entities/shipment-regime';

export class ShipmentRegimeService {
  public async listByShipmenttId(shipmentId: number): Promise<ShipmentRegime[]> {
    return await getManager().getRepository(ShipmentRegime).find({
      where: { shipment: { id: shipmentId } },
      order: { id: 'DESC' },
    });
  }

  public async saveChanges(shipmentRegimen: ShipmentRegime[]): Promise<InsertResult> {
    return await getManager().createQueryBuilder().insert().into(ShipmentRegime).values(shipmentRegimen).execute();
  }

  public async remove(shipmentId: number): Promise<DeleteResult> {
    return await getManager().getRepository(ShipmentRegime).delete({ shipment: { id: shipmentId } });
  }
}
