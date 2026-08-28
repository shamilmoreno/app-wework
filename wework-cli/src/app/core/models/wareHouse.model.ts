import { BagRecipeModel } from '@core/models/bag-recipe.model';

export class WareHouseModel {
	id?: number;
	code?: string;
	name?: string;
	address?: string;
	createdAt?: string;
	updatedAt?: string;
	isDefault?: boolean;
    default?: number;

	bagRecipes?: BagRecipeModel[];
}
