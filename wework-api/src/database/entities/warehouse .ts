import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserWarehouse } from "./user-warehouse ";
import { InventoryMovement } from "./inventory-movement";
import { InventoryStock } from "./inventory-stock ";
import { BagRecipe } from "./bag-recipe";
import { State } from "./state";
import { City } from "./city";

@Entity()
export class WareHouse {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 50, unique: true })
  public code!: string; // WH-CCS-01

  @Column({ type: "varchar", length: 100 })
  public name!: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  public address!: string;

  @Column({ type: "text", nullable: true })
  public description!: string;

  @Column({ default: true })
  public isActive: boolean = true;

  @CreateDateColumn({ type: "timestamp" })
  public createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt!: Date;

  // Relaciones
  @OneToMany(() => BagRecipe, (b) => b.warehouse)
  public bagRecipes!: BagRecipe[];

  @OneToMany(() => InventoryStock, (s) => s.warehouse)
  public stock!: InventoryStock[];

  @OneToMany(() => InventoryMovement, (m) => m.warehouse)
  public movements!: InventoryMovement[];

  @OneToMany(() => UserWarehouse, (uw) => uw.warehouse)
  public userWarehouses!: UserWarehouse[];

  @ManyToOne(() => State, { nullable: true })
  public state!: State;

  @ManyToOne(() => City, { nullable: true })
  public city!: City;
}
