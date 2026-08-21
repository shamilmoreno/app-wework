import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Shipment } from './shipment';
import { Subcategory } from './subcategory';

@Entity()
export class ShipmentRegime {
  @PrimaryGeneratedColumn()
  public id: number;

  // Relations
  @ManyToOne(
    () => Shipment,
    (shipment: Shipment) => shipment.legalRegimes,
    { onDelete: 'CASCADE' })
  public shipment: Shipment;

  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public legalRegimes: Subcategory;
}
