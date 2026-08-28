import { InventoryModel } from '@core/models/inventory.model';
export class ProductModel {
	id?: number;
	imageUrl?: string;
	sku?: string;
	name?: string
	createdAt?: string;

	// RELATIONS
	unitMeasurec?: any;
	stock?: InventoryModel;

	// 👇 Agregar esta línea
	selected?: boolean;
}
