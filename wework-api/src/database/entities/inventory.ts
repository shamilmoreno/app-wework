import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InventoryMovement } from './inventory-movement';
import { Product } from './product';

@Entity()
export class Inventory {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'int' })
	public quantityProductStock: number;

	@Column({ type: 'date' })
	public createdAt: string;

	// RELATIONS
	@OneToOne(() => Product,
		(product: Product) => product.stock,
		{ onDelete: 'SET NULL' })

	@JoinColumn()
	public product: Product;

	@OneToMany(
		() => InventoryMovement,
		(inventoryMovement: InventoryMovement) => inventoryMovement.inventoryStock,
		 { cascade: ['insert', 'update'] }
	)
	public inventoryMovements: InventoryMovement[];
}

