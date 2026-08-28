import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductionOrder } from './production-order ';
import { Product } from './product';

@Entity() /* (productos requeridos por orden) */
export class ProductionOrderItem {
	@PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "int" })
  public requiredQuantity: number;

  @Column({ type: "int", default: 0 })
  public consumedQuantity: number;

  @ManyToOne(() => Product, { onDelete: "SET NULL" })
  public product: Product;

  @ManyToOne(() => ProductionOrder, (po) => po.items, { onDelete: "CASCADE" })
  public productionOrder: ProductionOrder;
}
