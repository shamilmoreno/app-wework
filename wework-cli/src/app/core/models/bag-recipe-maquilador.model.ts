import { BagRecipeModel } from "./bag-recipe.model";
import { CompanyModel } from "./company.model";

export class BagRecipeMaquiladorModel {
	id?: number;
	assignedBags?: number;
	isPrimary?: boolean;
	productionPercentage?: number;


	// RELA
	bagRecipe?: BagRecipeModel;
	company?: CompanyModel;
}