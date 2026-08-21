import { BagRecipeMaquiladorModel } from '@core/models/bag-recipe-maquilador.model';
import { ProductModel } from './product.model';

export class BagRecipeItemModel {
	id?: number;
	imageUrl?: string;
	name?: string;
	quantity?: number;
	totalQuantityRequired?: number;
	costPrice?: number;
	costPriceBs?: number;
	totalCostPrice?: number;
	totalCostPriceBs?: number;
	salePrice?: number;
	salePriceBs?: number;
	totalSalePrice?: number;
	totalSalePriceBs?: number;
	freightAmount?: number;
	freightAmountBs?: number;
	totalFreightAmount?: number;
	totalFreightAmountBs?: number;
	stock?: number;

	// RELATIONS
	bagRecipe?: number;
	product?: ProductModel;

	// Distribución dinámica
	maquiladores?: BagRecipeMaquiladorModel[];

	// 👇 Agregar esta línea
	selected?: boolean;
}
