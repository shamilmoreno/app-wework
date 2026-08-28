import { DeleteResult, getConnection, getManager, InsertResult } from 'typeorm';
import { ShipmentObservation } from './../../database/entities/shipment-observation';

export class ShipmentObservationService {
  public async listByShipmenttId(shipmentId: number): Promise<ShipmentObservation[]> {
    return await getManager().getRepository(ShipmentObservation).find({
      where: { shipment: { id: shipmentId } },
      order: { id: 'DESC' },
    });
  }

  public async saveChanges(shipmentObservation: ShipmentObservation[]): Promise<InsertResult> {
    return await getManager().createQueryBuilder().insert().into(ShipmentObservation).values(shipmentObservation).execute();
  }

  public async remove(shipmentId: number): Promise<DeleteResult> {
    return await getManager().getRepository(ShipmentObservation).delete({ shipment: { id: shipmentId } });
  }
}
