import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import { HttpResponseService } from '../../core/services/http-response.service';
import messages from '../../core/helpers/messages';
import { User } from '../../database/entities/user';
import { BagRecipe } from '../../database/entities/bag-recipe';
import { BagRecipeProduct } from '../../database/entities/bag-recipe-product';
import { ProductService } from '../../core/services/product.service';
import { Inventory } from '../../database/entities/inventory';
import { InventoryMovement } from '../../database/entities/inventory-movement';
import { BagRecipeService } from '../../core/services/bag-recipe.service';
import { BagRecipeProductService } from '../../core/services/bag-recipe-product.service';
import { InventoryStockService } from '../../core/services/inventory-stock.service';
import { InventoryMovementService } from '../../core/services/inventory-movement.service';
import { JWTService } from '../../core/services/jwt.service';
import { UserService } from '../../core/services/user.service';
import { getCurrentDate } from '../../core/helpers/str-utils';
import { MovementType } from '../../core/enums/movement-type.enum';

export class BagRecipeProductController {
	/**
 * Carga todos los productos de un recipe
 * @param req Solicitud
 * @param res Respuesta
 */
	public async ctrlListByBagRecipetId(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeProductService = new BagRecipeProductService();
			const recipeBagItem: BagRecipeProduct[] = await bagRecipeProductService.listProductsByBagRecipeId(parseInt(req.params.id));
			HttpResponseService.response(res, 200, recipeBagItem, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crear o actualiza los productos de un recipe
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreateOrUpdate(req: Request, res: Response): Promise<void> {
		try {
			const newProductsForRecipe: BagRecipeProduct[] = req.body.products;
			const bagRecipeIdNew = req.body.id;
			const listOfFixedProducts: BagRecipeProduct[] = [];
			const bagRecipeService = new BagRecipeService();
			const bagRecipeProductService = new BagRecipeProductService();
			const productService = new ProductService();
			const inventoryStockService = new InventoryStockService();
			const inventoryMovementService = new InventoryMovementService();
			const userService = new UserService();
			const jwtService = new JWTService();

			//console.log('Aqui los productos que se paso previo  que se van a guardar en ctrlCreateOrUpdate', newProductsForRecipe)

			// Get the jwt token from the head
			const token = req.headers.authorization;
			let payload: any;
			let currentUser = new User();

			// Decode JWT
			payload = jwtService.decodeToken(token);

			// Seach user in the database
			currentUser = await userService.searchUserByIdAndToken(payload.id, token);

			// Find Bag Recipe
			const bagRecipe: BagRecipe = await bagRecipeService.getOneOnlyObject(bagRecipeIdNew);

			if (bagRecipe) {
				let currentProductsForRecipe: BagRecipeProduct[];
				//let currentProductsForRecipe: BagRecipeProduct[];
				let isNew = false;

				// Get current products /* Esta como repetido abajo */
				currentProductsForRecipe = await bagRecipeProductService.listProductsByBagRecipeId(bagRecipeIdNew);

				//  If you do not get any product it is because the Recipe is new
				if (currentProductsForRecipe.length === 0) {
					isNew = true;
				}

				// Working to add items (Check if products exist)
				if (newProductsForRecipe.length > 0) {
					// Delete all products
					await bagRecipeProductService.remove(bagRecipeIdNew);

					// The new recipe products object is built
					newProductsForRecipe.forEach(async (i: any) => {
						const uProduct = new BagRecipeProduct();

						uProduct.bagRecipe = bagRecipeIdNew;
						uProduct.product = i.id
						uProduct.productQuantity = (/,/.test(i.productQuantity)) ? i.productQuantity.replace(/,/g, '') : i.productQuantity;
						uProduct.quantityProductRequired = (/,/.test(i.quantityProductRequired)) ? i.quantityProductRequired.replace(/,/g, '') : i.quantityProductRequired;
						uProduct.priceProduct = (/,/.test(i.priceProduct)) ? i.priceProduct.replace(/,/g, '') : i.priceProduct;
						uProduct.totalCostPrice = (/,/.test(i.totalCostPrice)) ? i.totalCostPrice.replace(/,/g, '') : i.totalCostPrice;
						uProduct.priceSale = (/,/.test(i.priceSale)) ? i.priceSale.replace(/,/g, '') : i.priceSale;
						uProduct.totalSalePrice = (/,/.test(i.totalSalePrice)) ? i.totalSalePrice.replace(/,/g, '') : i.totalSalePrice;
						uProduct.amountMaquiladorMajor = (/,/.test(i.amountMaquiladorMajor)) ? i.amountMaquiladorMajor.replace(/,/g, '') : i.amountMaquiladorMajor;
						uProduct.amountMaquiladorCooperator = (/,/.test(i.amountMaquiladorCooperator)) ? i.amountMaquiladorCooperator.replace(/,/g, '') : i.amountMaquiladorCooperator;
						uProduct.amountDollarsMaquiladorMajor = (/,/.test(i.amountDollarsMaquiladorMajor)) ? i.amountDollarsMaquiladorMajor.replace(/,/g, '') : i.amountDollarsMaquiladorMajor;
						uProduct.amountDollarsMaquiladorCooperator = (/,/.test(i.amountDollarsMaquiladorCooperator)) ? i.amountDollarsMaquiladorCooperator.replace(/,/g, '') : i.amountDollarsMaquiladorCooperator;
						uProduct.amountFreightForProduct = (/,/.test(i.amountFreightForProduct)) ? i.amountFreightForProduct.replace(/,/g, '') : i.amountFreightForProduct;
						uProduct.totalFreightForProduct = (/,/.test(i.totalFreightForProduct)) ? i.totalFreightForProduct.replace(/,/g, '') : i.totalFreightForProduct;

						// Sanitize data
						sanitize(uProduct);

						// Save on array
						listOfFixedProducts.push(uProduct);
					});
					//console.log('Aqui los productos que se van a guardar en ctrlCreateOrUpdate', listOfFixedProducts)
					// Save Changes by new products object
					const productSaveTrue = await bagRecipeProductService.saveChanges(listOfFixedProducts);

					// If it is new, new products already updated are recovered
					if (isNew) {
						currentProductsForRecipe = await bagRecipeProductService.listProductsByBagRecipeId(bagRecipeIdNew);
					}

					// Se verifica si se guardo el nuevo objeto (newProducts) y si se obtuvo el objeto currentProductsForRecipe con sus datos actuales
					if (productSaveTrue && currentProductsForRecipe) {
						currentProductsForRecipe.forEach(async (currentProduct: { product: { name: any; id: any; }; quantityProductRequired: number; bagRecipe: BagRecipe; }) => {
							try {
								// Se guarda el nombre actual del producto.
								const currentProductName = currentProduct.product.name;

								//  Se filtra el objeto newProducts para excluir la BOLSA
								if (currentProductName != 'Bolsa') {
									const nProduct = listOfFixedProducts.find(nProd => Number(nProd.product) === Number(currentProduct.product.id));
									if (nProduct) {
										const inventoryMovement = new InventoryMovement();
										const currentInventoryStock = new Inventory();
										let verificationResult: string;

										const product = await productService.getOne(Number(nProduct.product));

										// Se verifica si es un nuevo registro
										if (isNew) {
											verificationResult = 'equal'; // Es igual

											if (nProduct.quantityProductRequired != 0) {
												inventoryMovement.description = 'Salida de stock inventario: reducción y registro de productos retirados, disminuyendo la cantidad disponible';
												inventoryMovement.destination = 'Receta';
												inventoryMovement.guideNumber = bagRecipe.serialCode;
												inventoryMovement.quantityProductMoved = nProduct.quantityProductRequired;
												inventoryMovement.movementType = MovementType.OUTPUT;
												inventoryMovement.responsibleUser = currentUser.firstName + ' ' + currentUser.lastName;
												inventoryMovement.stockAfterMovement = Number(product.stock.quantityProductStock) - nProduct.quantityProductRequired;
												inventoryMovement.referenceType = 'BagRecipe';
												inventoryMovement.referenceId = currentProduct.bagRecipe.serialCode;
												inventoryMovement.inventoryStock = product.stock;
												inventoryMovement.date = getCurrentDate();
												inventoryMovement.createdAt = getCurrentDate();

												// Se guarda el movimineto en Inventario Movimientos
												let resultInventoryMovement = await inventoryMovementService.saveChanges(inventoryMovement);
												//console.log('Resultado del movimiento', inventoryMovement.inventoryStock);

												// If the movement in the inventory is saved, if the stock of the products is updated
												if (resultInventoryMovement) {
													currentInventoryStock.id = inventoryMovement.inventoryStock.id;
													currentInventoryStock.quantityProductStock = Number(product.stock.quantityProductStock) - nProduct.quantityProductRequired;

													// The stock of the product is updated after saving the movement
													await inventoryStockService.update(currentInventoryStock);
												}
											}
											// Si no es un producto nuevo, se verifica si la cantidad de producto requerida en los datos entrantes es MAYOR que la cantidad ya registrada en la base de datos.
										} else if (nProduct.quantityProductRequired > currentProduct.quantityProductRequired) {
											verificationResult = 'greater'; // Es mayor

											inventoryMovement.description = 'Salida de stock inventario: reducción y registro de productos retirados, disminuyendo la cantidad disponible';
											inventoryMovement.destination = 'Receta';
											inventoryMovement.guideNumber = bagRecipe.serialCode;
											inventoryMovement.quantityProductMoved = nProduct.quantityProductRequired - currentProduct.quantityProductRequired;
											inventoryMovement.movementType = MovementType.OUTPUT;
											inventoryMovement.responsibleUser = currentUser.firstName + ' ' + currentUser.lastName;
											inventoryMovement.stockAfterMovement = Number(product.stock.quantityProductStock) - (nProduct.quantityProductRequired - currentProduct.quantityProductRequired);
											inventoryMovement.referenceType = 'BagRecipe';
											inventoryMovement.referenceId = currentProduct.bagRecipe.serialCode;
											inventoryMovement.inventoryStock = product.stock;
											inventoryMovement.date = getCurrentDate();
											inventoryMovement.createdAt = getCurrentDate();

											// Se guarda el movimineto en Stock Movimiento
											let resultInventoryMovement = await inventoryMovementService.saveChanges(inventoryMovement);
											//console.log('Resultado del movimiento', inventoryMovement.inventoryStock);

											if (resultInventoryMovement) {
												currentInventoryStock.id = inventoryMovement.inventoryStock.id;
												currentInventoryStock.quantityProductStock = Number(product.stock.quantityProductStock) - (nProduct.quantityProductRequired - currentProduct.quantityProductRequired);

												// The stock of the product is updated after saving the movement
												await inventoryStockService.update(currentInventoryStock);
											}

											// Si no es un producto nuevo, se verifica si la cantidad de producto requerida en los datos entrantes es MENOR que la cantidad ya registrada en la base de datos.
										} else if (nProduct.quantityProductRequired < currentProduct.quantityProductRequired) {
											verificationResult = 'lesser'; // Es menor

											inventoryMovement.description = 'Devolución de stock al inventario: proceso de registrar y restituir productos que han sido retornados, ajustando y aumentando la cantidad disponible en el inventario.';
											inventoryMovement.destination = 'Receta';
											inventoryMovement.guideNumber = bagRecipe.serialCode;
											inventoryMovement.quantityProductMoved = (nProduct.quantityProductRequired != 0) ? currentProduct.quantityProductRequired - nProduct.quantityProductRequired : currentProduct.quantityProductRequired;
											inventoryMovement.movementType = MovementType.RETURN;
											inventoryMovement.responsibleUser = currentUser.firstName + ' ' + currentUser.lastName;
											inventoryMovement.stockAfterMovement = Number(product.stock.quantityProductStock) + ((nProduct.quantityProductRequired != 0) ? currentProduct.quantityProductRequired - nProduct.quantityProductRequired : currentProduct.quantityProductRequired);
											inventoryMovement.referenceType = 'BagRecipe';
											inventoryMovement.referenceId = currentProduct.bagRecipe.serialCode;
											inventoryMovement.inventoryStock = product.stock;
											inventoryMovement.date = getCurrentDate();
											inventoryMovement.createdAt = getCurrentDate();

											// Se guarda el movimineto en Stock Movimiento
											let resultInventoryMovement = await inventoryMovementService.saveChanges(inventoryMovement);
											//console.log('Resultado del movimiento', inventoryMovement.inventoryStock);

											if (resultInventoryMovement) {
												console.log('Si entre a actualizar el Stock del Productos:', inventoryMovement.inventoryStock.product);
												currentInventoryStock.id = inventoryMovement.inventoryStock.id;
												currentInventoryStock.quantityProductStock = Number(product.stock.quantityProductStock) + ((nProduct.quantityProductRequired != 0) ? currentProduct.quantityProductRequired - nProduct.quantityProductRequired : currentProduct.quantityProductRequired);

												// The stock of the product is updated after saving the movement
												await inventoryStockService.update(currentInventoryStock);
											}
										}
										/* console.log('Aqui te muestro el Inventario Stock antes de guaradarlo', currentInventoryStock);
										await inventoryStockService.saveChanges(currentInventoryStock); */
									}
								}
							} catch (error) {
								HttpResponseService.response(res, 500, error, messages.general.error);
							}

						});
					}
				}

				//await bagRecipeService.saveChanges(bagRecipe);

				// Response
				HttpResponseService.response(res, 200, null, messages.bagRecipe.bagRecipeDetailUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Remueve los productos de una receta
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeService = new BagRecipeService();
			const bagRecipeProductService = new BagRecipeProductService();

			// Find recipe
			const bagRecipe: BagRecipe = await bagRecipeService.getOneOnlyObject(req.body.id);

			if (bagRecipe) {
				// Delete all Products
				await bagRecipeProductService.remove(bagRecipe.id);

				// Response
				HttpResponseService.response(res, 200, null, messages.bagRecipe.bagRecipeDetailUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}
}
