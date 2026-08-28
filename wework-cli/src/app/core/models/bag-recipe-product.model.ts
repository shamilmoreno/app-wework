export class ProductDetailModel {
	id?: number;
	name?: string;

	bagRecipeId?: number;
	productQuantity?: string;
	quantityProductRequired?: string;
	priceProduct?: string;
	totalCostPrice?: string;
	priceSale?: string;
	totalSalePrice?: string;
	amountMaquiladorMajor?: string;
	amountMaquiladorCooperator?: string;
	amountDollarsMaquiladorMajor?: string;
	amountDollarsMaquiladorCooperator?: string;
	totalFreightForProduct?: string;
	amountFreightForProduct?: string;
	product?: any;
	currentProductStock?: number;
}