import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BagRecipeItem } from "./bag-recipe-item";
import { BagRecipePayment } from "./bag-recipe-payment";
import { v4 as uuidv4 } from "uuid";
import { BagRecipeMaquiladorProduction } from "./bag-recipe-maquilador-production";
import { WareHouse } from "./warehouse ";

@Entity()
export class BagRecipe {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 255, unique: true })
  public serialCode: string;

  @Column({ type: "date" })
  public monthRecipeBag: string;

  @Column({ type: "numeric", default: 0, precision: 20 })
  public numberBags: number;

  @Column({ type: "numeric", default: 0, precision: 12, scale: 2 })
  public operatingExpense: number;

  @Column({ type: "numeric", default: 0, precision: 12, scale: 2 })
  public maquila: number;

  @Column({ type: "numeric", default: 0, precision: 12, scale: 2 })
  public tax: number;

  @Column({ type: "numeric", default: 0, precision: 12, scale: 2 })
  public commission: number;

  @Column({ default: true })
  public isActive: boolean;

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date;

  // RELATIONS
  @OneToMany(() => BagRecipeMaquiladorProduction, (m) => m.bagRecipe)
  public maquiladors: BagRecipeMaquiladorProduction[];

  @OneToMany(() => BagRecipeItem, (p) => p.bagRecipe)
  public items: BagRecipeItem[];
  
  @OneToMany(() => BagRecipePayment, (pay) => pay.bagRecipe)
  public payments: BagRecipePayment[];

  @ManyToOne(() => WareHouse, (w) => w.bagRecipes, { onDelete: "SET NULL" })
  public warehouse: WareHouse;

  @BeforeInsert()
  generateSerialCode() {
    const date = new Date(this.monthRecipeBag);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Asegura que el mes tenga dos dígitos
    this.serialCode = `REC-${year}${month}-${uuidv4().slice(0, 8)}`;
  }
}
