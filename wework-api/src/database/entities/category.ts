import { Trim } from 'class-sanitizer';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subcategory } from './subcategory';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: false })
  public editable: boolean;

  @Column({ length: 3, unique: true })
  @MaxLength(3, { message: 'El campo <nem> es demasiado largo' })
  @MinLength(3, { message: 'El campo <nem> es demasiado corto' })
  @Trim()
  public nem: string;

  @Column({ length: 50 })
  @MaxLength(50, { message: 'El campo <name> es demasiado largo' })
  @MinLength(3, { message: 'El campo <name> es demasiado corto' })
  @Trim()
  public name: string;

  @Column({ length: 100 })
  @MaxLength(100, { message: 'El campo <description> es demasiado largo' })
  @MinLength(10, { message: 'El campo <description> es demasiado corto' })
  @Trim()
  public description: string;

  // Relations
  @OneToMany(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.category,
    { onDelete: 'CASCADE' })
  public subcategories: Subcategory[];
}
