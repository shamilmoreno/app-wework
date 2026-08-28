import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Product } from './product';
import { WareHouse } from './warehouse ';

@Entity()
@Unique(["product", "warehouse"])
export class InventoryStock {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "int", default: 0 })
    public quantity: number;

    @CreateDateColumn({ type: "timestamp" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    public updatedAt: Date;

    // RELATIONS
    @ManyToOne(() => Product, (p) => p.stock, { onDelete: "CASCADE" })
    public product: Product;

    @ManyToOne(() => WareHouse, (w) => w.stock, { onDelete: "CASCADE" })
    public warehouse: WareHouse;
}

