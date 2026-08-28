import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BagRecipe } from "./bag-recipe";
import { BagRecipeMaquiladorItem } from "./bag-recipe-maquilador-item";
import { Company } from "./company";

@Entity()
export class BagRecipeMaquiladorProduction {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "numeric", default: 0, precision: 20 })
	public assignedBags: number;

	@Column({ default: false })
	public isPrimary: boolean;

	@Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
	public productionPercentage: number;

	@CreateDateColumn({ type: "timestamp" })
	public createdAt: Date;
	
	@UpdateDateColumn({ type: "timestamp" })
	public updatedAt: Date;

	// Relations
	@ManyToOne(() => BagRecipe, (b) => b.maquiladors, { onDelete: 'CASCADE' })
  	public bagRecipe: BagRecipe;

  	@ManyToOne(() => Company, (c) => c.maquiladorAssignments, { onDelete: 'SET NULL' })
  	public company: Company;
	
  	@OneToMany(() => BagRecipeMaquiladorItem, (i) => i.maquiladorProduction, {cascade: true})
  	itemDistributions: BagRecipeMaquiladorItem[];
}
