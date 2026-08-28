import { InventoryModel } from '@core/models/inventory.model';
import { MyValidators } from '@core/helpers/my-validators';
import { BagRecipeModel } from '@core/models/bag-recipe.model';
import { ProductModel } from '@core/models/product.model';
import { WareHouseModel } from '@core/models/wareHouse.model';

export class ModelMapper {
  static mapResponseToInventoryList(response: any[], imagePathServer: string): InventoryModel[] {
    return response.map((item) => ({
      id: item.id,
      imageUrl: imagePathServer + item.product.imageUrl,
      sku: item.product.sku,
      product: item.product?.name ?? '',
      quantityProductStock: MyValidators.numberFormat(item.quantity),
    }));
  }

  static mapResponseToProductList(response: any[], imagePathServer: string): ProductModel[] {
    return response.map((item) => ({
      id: item.id,
      imageUrl: imagePathServer + item.imageUrl,
      sku: item.sku,
      name: item.name,
    }));
  }

  static mapResponseToWareHouseList(response: any[]): WareHouseModel[] {
    return response.map((item) => ({
        code: item.code,
      	name: item.name,
      	address: item.address
    }));
  }

  static mapResponseToBagRecipeList(response: any[]): BagRecipeModel[] {
    return response.map((item) => {
      let valuePriceCost = 0;
      let valueSalePrice = 0;

      // Calcular costos y precios
      item.products?.forEach((p: any) => {
        valuePriceCost += Number(p.priceProduct) * Number(p.productQuantity);
        valueSalePrice += Number(p.priceSale) * Number(p.productQuantity);
      });

      // Buscar el maquilador principal
      const maquiladorPrincipal = item.maquiladors?.find((m: any) => m.isPrimary === true);
      const nombreMaquiladorPrincipal = maquiladorPrincipal?.company?.businessName || '';
      console.log('Lista de los Recipes en el mapResponseToBagRecipeList', item);

      /* return {
				id: item.id,
				serialCode: item.serialCode,
				maquiladorBag: nombreMaquiladorPrincipal,
				numberBags: MyValidators.numberFormat(item.numberBags),
				monthRecipeBag: moment(item.monthRecipeBag).format('MMMM YYYY').toUpperCase(),
				products: item.products,
			} as BagRecipeModel; */

      return {
        id: item.id,
        serialCode: item.serialCode,
        maquiladorBag: nombreMaquiladorPrincipal,
        numberBags: Number(item.numberBags || 0), // Convierte el texto a número
        monthRecipeBag: item.monthRecipeBag,
        products: item.products,
      } as unknown as BagRecipeModel;
    });
  }
}
