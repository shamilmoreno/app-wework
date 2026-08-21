import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BagRecipe } from './bag-recipe';
import { Subcategory } from './subcategory';
import { Product } from './product';

@Entity()
export class BagRecipeProduct {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'int' })
	public productQuantity: number;

	@Column({ type: 'int' })
	public quantityProductRequired: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public priceProduct: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public priceSale: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public totalCostPrice: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public totalSalePrice: number;

	@Column({ type: 'int' })
	public amountMaquiladorMajor: number;

	@Column({ type: 'int' })
	public amountMaquiladorCooperator: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public amountDollarsMaquiladorMajor: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public amountDollarsMaquiladorCooperator: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public amountFreightForProduct: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public totalFreightForProduct: number;

	// Relations
	@ManyToOne( /** Relacion entre BAgRecipeProduct y BagRecipe */
		() => BagRecipe,
		(bagRecipe: BagRecipe) => bagRecipe.products,
		{ onDelete: 'SET NULL' })
	public bagRecipe: BagRecipe;

	@ManyToOne( /** Relacion entre BAgRecipeProduct y Product */
		() => Product,
		(product: Product) => product.bagRecipeProduct,
		{ onDelete: 'CASCADE' })
	product: Product;
}
