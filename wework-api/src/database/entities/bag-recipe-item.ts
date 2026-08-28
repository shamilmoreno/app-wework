import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BagRecipe } from './bag-recipe';
import { Product } from './product';
import { BagRecipeMaquiladorItem } from './bag-recipe-maquilador-item';

@Entity()
export class BagRecipeItem {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'int' })
	public quantity: number;

	@Column({ type: 'int' })
	public totalQuantityRequired: number;

	// --- Valores en Dólares ---
	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public costPrice: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public totalCostPrice: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public salePrice: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public totalSalePrice: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public freightAmount: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public totalFreightAmount: number;

	// --- Valores en Bolívares ---
	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public costPriceBs: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public totalCostPriceBs: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public salePriceBs: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public totalSalePriceBs: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public freightAmountBs: number;

	@Column({ type: 'numeric', default: 0, precision: 12, scale: 2 })
	public totalFreightAmountBs: number;

	@CreateDateColumn({ type: "timestamp" })
	public createdAt: Date;

	@UpdateDateColumn({ type: "timestamp" })
	public updatedAt: Date;

	// Relations
	@Index()
	@ManyToOne(() => BagRecipe, (b) => b.items, { onDelete: 'CASCADE' })
	public bagRecipe: BagRecipe;

	@ManyToOne(() => Product, (p) => p.bagRecipeItem, { onDelete: 'CASCADE' })
	public product: Product;

	@OneToMany(() => BagRecipeMaquiladorItem, (s) => s.bagRecipeItem, { cascade: true })
	public supplies: BagRecipeMaquiladorItem[];
}
