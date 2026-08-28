import { Trim } from 'class-sanitizer';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 400, nullable: false })
  @MaxLength(400, { message: 'El campo <name> es demasiado largo' })
  @MinLength(3, { message: 'El campo <name> es demasiado corto' })
  @Trim()
  public name: string;

  // Relations
  @ManyToOne(
    () => Category,
    (category: Category) => category.subcategories,
    { onDelete: 'CASCADE' })
  public category: Category;
}
