import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BagRecipe } from './bag-recipe';
import { WareHouse } from './warehouse ';
import { ProductionOrderItem } from './production-order-item ';

@Entity() /* (orden de producción) */
export class ProductionOrder  {
	@PrimaryGeneratedColumn()
  	public id: number;

  	@Column({ type: "int" })
  	public requestedBags: number;

  	@Column({ type: "varchar", length: 50, default: "CREATED" })
  	public status: string; // CREATED, IN_PROGRESS, COMPLETED

  	@ManyToOne(() => BagRecipe, { onDelete: "CASCADE" })
  	public bagRecipe: BagRecipe;

  	@ManyToOne(() => WareHouse, { onDelete: "SET NULL" })
  	public sourceWarehouse: WareHouse; // de dónde salen los insumos

	@ManyToOne(() => WareHouse, { onDelete: "SET NULL" })
  	public targetWarehouse: WareHouse; // dónde se almacenan las bolsas terminadas

  	@CreateDateColumn({ type: "timestamp" })
  	public createdAt: Date;

  	@UpdateDateColumn({ type: "timestamp" })
  	public updatedAt: Date;

  	@OneToMany(() => ProductionOrderItem, (item) => item.productionOrder, { cascade: true })
  	public items: ProductionOrderItem[];
}
