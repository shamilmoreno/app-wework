import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WareHouse } from './warehouse ';
import { ProductionOrder } from './production-order ';

@Entity() /* (orden de producción) */
export class ProductionBatch   {
	@PrimaryGeneratedColumn()
  	public id: number;

  	@Column({ type: "varchar", length: 100 })
  	public batchCode: string;

  	@Column({ type: "int" })
  	public producedQuantity: number;

  	@ManyToOne(() => ProductionOrder, { onDelete: "CASCADE" })
  	public productionOrder: ProductionOrder;

  	@ManyToOne(() => WareHouse, { onDelete: "SET NULL" })
  	public warehouse: WareHouse;

  	@CreateDateColumn({ type: "timestamp" })
  	public createdAt: Date;
}
