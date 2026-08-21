import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BagRecipe } from './bag-recipe';
import { MaxLength, MinLength } from 'class-validator';
import { Trim } from 'class-sanitizer';

@Entity()
export class BagRecipePayment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 50 })
  @MaxLength(50, { message: 'El campo <name> es demasiado largo' })
  @MinLength(3, { message: 'El campo <name> es demasiado corto' })
  @Trim()
  public name: string;

  @Column({ type: 'date' })
  public paymentDate: string;

  @Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
  public amount: number;

  @Column({ length: 200 })
  @MaxLength(50, { message: 'El campo <description> es demasiado largo' })
  @MinLength(3, { message: 'El campo <description> es demasiado corto' })
  @Trim()
  public description: string;

  @Column({ length: 50 })
  @MaxLength(50, { message: 'El campo <paymentMethod> es demasiado largo' })
  @MinLength(3, { message: 'El campo <paymentMethod> es demasiado corto' })
  @Trim()
  public paymentMethod: string;

  @Column({ length: 100 })
  @MaxLength(50, { message: 'El campo <referenceNumber> es demasiado largo' })
  @MinLength(3, { message: 'El campo <referenceNumber> es demasiado corto' })
  @Trim()
  public referenceNumber: string;

  // Relations
  @ManyToOne(
    () => BagRecipe,
    (bagRecipe: BagRecipe) => bagRecipe.payments,
    { onDelete: 'CASCADE' })
  public bagRecipe: BagRecipe;
}
