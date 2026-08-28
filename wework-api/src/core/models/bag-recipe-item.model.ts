import { BagRecipeMaquiladorModel } from '../models/bag-recipe-maquilator.model';
import { ProductModel } from '../models/product.model';

export class BagRecipeItemModel {
	id?: number;
	imageUrl?: string;
	name?: string;
	quantity?: number;
	totalQuantityRequired?: number;
	costPrice?: number;
	totalCostPrice?: number;
	salePrice?: number;
	totalSalePrice?: number;
	costPriceBs?: number;
	totalCostPriceBs?: number;
	salePriceBs?: number;
	totalSalePriceBs?: number;
	freightAmount?: number;
	totalFreightAmount?: number;
	stock?: number;

	// RELATIONS
	bagRecipe?: number;
	product?: ProductModel;

	// Distribución dinámica
	maquiladores?: BagRecipeMaquiladorModel[];

	// 👇 Agregar esta línea
	selected?: boolean;
}