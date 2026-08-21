export class InventoryModel {
    id?: number;
    imageUrl?: string;
    quantity?: string;
    guideNumber?: string;
    date?: string;
    quantityProductMoved?: string;
    stockAfterMovement?: string;
    destination?: string;
    movementType?: any;
    referenceId?: any;
    referenceType?: any;
    description?: string;
    responsibleUser?: string;
    createdAt?: string;

    // RELATIONS
    product?: any;
    sku?: any;
    productId?: any;
    unitMeasurec?: any;
    unitMeasurecId?: any;
    inventoryStockId?: any;
}
