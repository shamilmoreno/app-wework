import { Trim } from 'class-sanitizer';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subcategory } from './subcategory';
import { Inventory } from './inventory';
import { BagRecipeProduct } from './bag-recipe-product';
import { InventoryMovement } from './inventory-movement';

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

	@Column({ type: 'date' })
	public createdAt: string;

	// RELATIONS
	@ManyToOne( /** RElacion entre Product y SubCategory */
		() => Subcategory,
		(subcategory: Subcategory) => subcategory.id,
		{ onDelete: 'SET NULL' })
	public unitMeasurec: Subcategory;

	@OneToMany( /** RElacion entre Product y BagRecipeProduct */
		() => BagRecipeProduct,
		(bagRecipeProduct: BagRecipeProduct) => bagRecipeProduct.product)
	public bagRecipeProduct: BagRecipeProduct;

	@OneToOne( /** RElacion entre Product y InventoryStock*/
		() => Inventory,
		(inventoryStock: Inventory) => inventoryStock.product)
	public stock: Inventory;
}
