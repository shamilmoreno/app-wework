import { Trim } from 'class-sanitizer';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user'
import { Subcategory } from './subcategory';

@Entity()
export class EmployeeData {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'date' })
  public birthdate: string;

  @Column({ length: 100 })
  @MaxLength(100, { message: 'El campo <address> es demasiado largo' })
  @MinLength(3, { message: 'El campo <address> es demasiado corto' })
  @Trim()
  public address: string;

  @Column({ type: 'bigint', unique: true })
  public documentNumber: number;

  @Column({ type: 'bigint' })
  public phone: number;

  @Column({ type: 'date' })
  public createdAt: string;

  // Relations
  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public documentType: Subcategory;

  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public country: Subcategory;

  @ManyToOne(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.id,
    { onDelete: 'SET NULL' })
  public gender: Subcategory;

  @OneToOne(
    () => User)
    @JoinColumn()
  public user: User  
}
