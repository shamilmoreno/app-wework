import { Trim } from 'class-sanitizer';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Shipment } from './shipment';
import { Subcategory } from './subcategory';

@Entity()
export class ShipmenNationalizationExpense {
  @PrimaryGeneratedColumn()
  public id: number;
  
  @Column({ type: 'date' })
  public paymentDate: string;

  @Column({ length: 100 })
  @MaxLength(100, { message: 'El campo <name> es demasiado largo' })
  @MinLength(3, { message: 'El campo <description> es demasiado corto' })
  @Trim()
  public paymentConcept: string;

  @Column({ length: 100 })
  @MaxLength(100, { message: 'El campo <name> es demasiado largo' })
  @Trim()
  public paymentReference: string;

  @Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
  public amountDollars: number;

  @Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
  public feeAmount: number;

  @Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
  public amountBolivars: number;

  @Column({ type: 'date' })
  public createdAt: string;

  // Relations
  @ManyToOne(
    () => Shipment,
    (shipment: Shipment) => shipment.observations,
    { onDelete: 'CASCADE' })
  public shipment: Shipment;

  @OneToMany(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.category,
    { onDelete: 'CASCADE' })
  public   typeExpense: Subcategory[];
}
