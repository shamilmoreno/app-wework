import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BagRecipe } from "./bag-recipe";
import { Company } from "./company";

@Entity()
export class BagRecipeMaquilador {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "numeric", default: 0, precision: 20 })
	public amount: number;

	@Column({ nullable: false })
	public maquiladorMajor: boolean;

	// Relations
	@ManyToOne(
		() => BagRecipe,
		(bagRecipe: BagRecipe) => bagRecipe.maquiladors,
		{ onDelete: "CASCADE" } // Opcional: elimina maquiladores si se elimina la receta
	)
	public bagRecipe: BagRecipe;

	// Relación con Company (maquilador)
	@ManyToOne(
		() => Company, 
		(company) => company.maquiladorAssignments, {
		onDelete: "SET NULL",
	})
	public company: Company;
}
