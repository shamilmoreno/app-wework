import { BagRecipeItemModel } from './bag-recipe-item.model';
import { PaymentDetailModel } from './bag-recipe-payment.model';
import { BagRecipeMaquiladorModel } from './bag-recipe-maquilador.model';
import { TotalsInterface } from '@core/interface/totals';
import { ProductModel } from './product.model';

export class BagRecipeModel {
	id?: number;
	img?: string;
	serialCode?: string;
	monthRecipeBag?: string;
	numberBags?: number;
	operatingExpense?: number;
	maquila?: number;
	tax?: number;
	commission?: number;
	createdAt?: string;

	 // RELATIONS
	maquiladors?: BagRecipeMaquiladorModel[];
	items?: BagRecipeItemModel[];
	payments?: PaymentDetailModel[];
	warehouse?: any[];
	totals?: TotalsInterface;
	products?: any;
	//products?: ProductModel;
}
