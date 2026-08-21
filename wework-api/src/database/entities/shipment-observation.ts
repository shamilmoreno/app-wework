import { Trim } from 'class-sanitizer';
import { MaxLength } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Shipment } from './shipment';

@Entity()
export class ShipmentObservation {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 100 })
  @MaxLength(100, { message: 'El campo <name> es demasiado largo' })
  @Trim()
  public title: string;

  @Column({ length: 100 })
  @MaxLength(100, { message: 'El campo <name> es demasiado largo' })
  @Trim()
  public description: string;

  @Column({ type: 'date' })
  public createdAt: string;

  // Relations
  @ManyToOne(
    () => Shipment,
    (shipment: Shipment) => shipment.observations,
    { onDelete: 'CASCADE' })
  public shipment: Shipment;
}
