import { InventoryModel } from '../models/inventory.model';
export class ProductModel {
	id?: number;
	imageUrl?: string;
	sku?: string;
	name?: string
	createdAt?: string;

	// RELATIONS
	unitMeasurec?: any;
	stock?: InventoryModel;
}
