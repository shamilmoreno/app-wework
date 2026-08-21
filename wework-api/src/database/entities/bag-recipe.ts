import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BagRecipeProduct } from "./bag-recipe-product";
import { BagRecipePayment } from "./bag-recipe-payment";
import { InventoryMovement } from "./inventory-movement";
import { v4 as uuidv4 } from "uuid";
import { BagRecipeMaquilador } from "./bag-recipe-maquilador";

@Entity()
export class BagRecipe {
  @PrimaryGeneratedColumn()
  public id: number;

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

  @Column({ type: "date" })
  public createdAt: string;

  @Column({ type: "varchar", length: 255, unique: true })
  public serialCode: string;

  // RELATIONS
  @OneToMany(
	/** Relacion entre BagRecipe y BAgRecipeCompañías */
    () => BagRecipeMaquilador,
    (maquilador: BagRecipeMaquilador) => maquilador.bagRecipe
  )
  public maquiladors: BagRecipeMaquilador[];

  @OneToMany(
    /** Relacion entre BagRecipe y BAgRecipeProduct */
    () => BagRecipeProduct,
    (bagRecipeProduct: BagRecipeProduct) => bagRecipeProduct.bagRecipe
  )
  public products: BagRecipeProduct[];

  @OneToMany(
    /** Relacion entre BagRecipe y BagRecipePayment*/
    () => BagRecipePayment,
    (sp: BagRecipePayment) => sp.bagRecipe
  )
  public payments: BagRecipePayment[];

  /** Relacion entre BagRecipe y InventoryMovement*/
 /*  @OneToMany(
    () => InventoryMovement,
    (inventoryMovement: InventoryMovement) => inventoryMovement.bagRecipe
  )
  public inventoryIssue: InventoryMovement[];
 */

/*   @OneToMany(
    () => InventoryMovement,
    (inventoryMovement: InventoryMovement) => inventoryMovement.bagRecipe,
    { cascade: true }
  )
  public inventoryIssue: InventoryMovement[]; */

  @BeforeInsert()
  generateSerialCode() {
    const date = new Date(this.monthRecipeBag);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Asegura que el mes tenga dos dígitos
    this.serialCode = `REC-${year}${month}-${uuidv4().slice(0, 8)}`;
  }
}
