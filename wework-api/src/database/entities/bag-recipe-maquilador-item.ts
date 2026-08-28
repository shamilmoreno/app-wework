import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BagRecipeItem } from "./bag-recipe-item";
import { BagRecipeMaquiladorProduction } from "./bag-recipe-maquilador-production";
import { Company } from "./company";

@Entity()
export class BagRecipeMaquiladorItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "numeric", default: 0, precision: 20 })
  public suppliedQuantity: number; // cuánto aportó el maquilador de este producto

  @Column({ type: "numeric", default: 0, precision: 12, scale: 2 })
  public unitPrice: number;

  @Column({ type: "numeric", default: 0, precision: 12, scale: 2 })
  public totalCost: number;

  // Relaciones
  @ManyToOne(() => BagRecipeItem, (p) => p.supplies, { onDelete: "CASCADE" })
  public bagRecipeItem: BagRecipeItem;

  @ManyToOne(() => BagRecipeMaquiladorProduction, (mp) => mp.itemDistributions, { onDelete: "SET NULL" }
  )
  public maquiladorProduction: BagRecipeMaquiladorProduction;

  @ManyToOne(() => Company, (c) => c.supplies, { onDelete: "SET NULL" })
  public company: Company;
}
