import { Trim } from 'class-sanitizer';
import { MaxLength, MinLength } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Subcategory } from './subcategory';
import { BagRecipeItem } from './bag-recipe-item';
import { InventoryStock } from './inventory-stock ';

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ unique: true, nullable: false })
	@MaxLength(50, { message: 'El campo <SKU> es demasiado largo' })
	@MinLength(3, { message: 'El campo <SKU> es demasiado corto' })
	@Trim()
	public sku: string;

	@Column({ length: 500 })
	@MaxLength(500, { message: 'El campo <businessName> es demasiado largo' })
	@MinLength(3, { message: 'El campo <businessName> es demasiado corto' })
	@Trim()
	public name: string;

	@Column({ nullable: true })
	@MaxLength(255, { message: 'El campo <imageUrl> es demasiado largo' })
	@Trim()
	public imageUrl: string;

	@Column({ default: true })
	public isActive: boolean;

	@Column({ default: 'unidad' })
	public baseUnit: 'unidad' | 'gramo' | 'kilo' | 'mililitro' | 'litro';

	@Column({ type: 'float', default: 1 })
	public unitQuantity: number; // Ej: 185 (gramos), 900 (ml), 500 (g), etc.

	@CreateDateColumn({ type: "timestamp" })
	public createdAt: Date;

	@UpdateDateColumn({ type: "timestamp" })
	public updatedAt: Date;

	// RELATIONS
	@ManyToOne( /** RElacion entre Product y SubCategory */
		() => Subcategory,
		(subcategory: Subcategory) => subcategory.id,
		{ onDelete: 'SET NULL' })
	public unitMeasurec: Subcategory;

	@OneToMany( /** RElacion entre Product y BagRecipeItem */
		() => BagRecipeItem,
		(bagRecipeItem: BagRecipeItem) => bagRecipeItem.product)
	public bagRecipeItem: BagRecipeItem;

	// Dentro del modelo Product
	@OneToMany(() => InventoryStock, (s) => s.product)
	public stock: InventoryStock[];
}
