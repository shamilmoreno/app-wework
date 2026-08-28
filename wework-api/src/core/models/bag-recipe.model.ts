import { Totals } from "../../core/interfaces/totals";
import { BagRecipeItemModel } from '../models/bag-recipe-item.model';

export class BagRecipeModel {
	id?: number;
	serialCode?: string;
	monthRecipeBag?: string;
	numberBags?: number;
	operatingExpense?: number;
	maquila?: number;
	tax?: number;
	commission?: number;
	maquiladors?: any;
	items?: BagRecipeItemModel;
	payments?: any;
	totals?: Totals; 
}