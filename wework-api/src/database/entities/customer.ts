import { Trim } from 'class-sanitizer';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


import { Subcategory } from './subcategory';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 500 })
  @MaxLength(500, { message: 'El campo <businessName> es demasiado largo' })
  @MinLength(3, { message: 'El campo <businessName> es demasiado corto' })
  @Trim()
  public businessName: string;

  @Column({ type: 'bigint', unique: true })
  public documentNumber: number;

  @Column({ nullable: true })
  public identificationCard: string;

  @Column({ unique: false })
  @IsEmail()
  public email: string;

  @Column({ length: 500 })
  @MaxLength(500, { message: 'El campo <address> es demasiado largo' })
  @MinLength(3, { message: 'El campo <address> es demasiado corto' })
  @Trim()
  public address: string;

  @Column({ type: 'bigint' })
  public phone: number;

  @Column({ type: 'date' })
  public createdAt: string;

  // Relations
  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public customerType: Subcategory;

  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public documentType: Subcategory;

  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public municipality: Subcategory;
}
