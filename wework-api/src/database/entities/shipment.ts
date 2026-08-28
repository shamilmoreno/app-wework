import { Trim } from 'class-sanitizer';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ShipmentObservation } from './shipment-observation';
import { ShipmenAdministrativeExpense } from './shipment-administrative-expense';
import { ShipmenNationalizationExpense } from './shipment-nationalization-expense';
import { ShipmentRegime } from './shipment-regime';
import { Subcategory } from './subcategory';
import { Provider } from './provider';

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 1000, unique: true })
  @MaxLength(20, { message: 'El campo <comentario> es demasiado largo' })
  @MinLength(3, { message: 'El campo <comentario> es demasiado corto' })
  @Trim()
  public bl: string;

  @Column({ length: 1000, unique: true })
  @MaxLength(20, { message: 'El campo <comentario> es demasiado largo' })
  @MinLength(3, { message: 'El campo <comentario> es demasiado corto' })
  @Trim()
  public license: string;

  @Column({ type: 'numeric', default: 0, precision: 10 })
  public containerQuantity: number;

  @Column({ type: 'numeric', default: 0, precision: 10 })
  public containerCapacity: number;
  
  @Column({ type: 'numeric', default: 0, precision: 10 })
  public quantityMetricTons: number;

  @Column({ type: 'numeric', default: 0, precision: 10 })
  public kilograms: number;

  @Column({ type: 'date' })
  public arrivalDate: string;

  @Column({ type: 'date' })
  public startDateDelay: string;

  @Column({ type: 'numeric', default: 0 })
  public freeDays: number;

  @Column({ type: 'numeric', default: 0 })
  public amountToPayDay: number;

  @Column({ type: 'numeric', default: 0 })
  public unitPrice: number;

  @Column({ type: 'numeric', default: 0 })
  public  daysLate: number;

  @Column({ type: 'numeric', default: 0.00, precision: 10, scale: 2 })
  public amountPayDelay: number;

  @Column({ default: false })
  public isDelayedShipment: boolean;

  @Column({ type: 'date' })
  public createdAt: string;
  
  // Relations
  @ManyToOne(
    () => Provider,
    (provider: Provider) => provider.id,
    { onDelete: 'CASCADE' })
  public provider: Provider;

  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public entryPort: Subcategory;

  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public origin: Subcategory;

  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public brand: Subcategory;

  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public description: Subcategory;

  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public state: Subcategory;

  @OneToMany(
    () => ShipmentObservation,
    (so: ShipmentObservation) => so.shipment)
  public observations: ShipmentObservation[];

  @OneToMany(
    () => ShipmenAdministrativeExpense,
    (sea: ShipmenAdministrativeExpense) => sea.shipment)
  public administrativeExpenses: ShipmenAdministrativeExpense[];

  @OneToMany(
    () => ShipmenNationalizationExpense,
    (sen: ShipmenNationalizationExpense) => sen.shipment)
  public nationalizationExpenses: ShipmenNationalizationExpense[];

  @OneToMany(
    () => ShipmentRegime,
    (sr: ShipmentRegime) => sr.shipment)
  public legalRegimes: ShipmentRegime[];
}
