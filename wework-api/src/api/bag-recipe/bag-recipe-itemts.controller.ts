import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import { HttpResponseService } from '../../core/services/http-response.service';
import messages from '../../core/helpers/messages';
import { User } from '../../database/entities/user';
import { BagRecipe } from '../../database/entities/bag-recipe';
import { BagRecipeItem } from '../../database/entities/bag-recipe-item';
import { ProductService } from '../../core/services/product.service';
import { InventoryStock } from '../../database/entities/inventory-stock ';
import { InventoryMovement } from '../../database/entities/inventory-movement';
import { BagRecipeService } from '../../core/services/bag-recipe.service';
import { BagRecipeItemService } from '../../core/services/bag-recipe-item.service';
import { InventoryStockService } from '../../core/services/inventory-stock.service';
import { InventoryMovementService } from '../../core/services/inventory-movement.service';
import { JWTService } from '../../core/services/jwt.service';
import { UserService } from '../../core/services/user.service';
import { getCurrentDate } from '../../core/helpers/str-utils';
import { MovementType } from '../../core/enums/movement-type.enum';

export class BagRecipeItemController {
	/**
	  * Carga todos los Items de una Bolsa
	  * @param req Solicitud
	  * @param res Respuesta
	  */
	public async ctrlListByBagRecipetId(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeItemService = new BagRecipeItemService();
			const bagItems: BagRecipeItem[] = await bagRecipeItemService.listItemsByBagRecipeId(parseInt(req.params.id));
			HttpResponseService.response(res, 200, bagItems, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crear o actualiza los Items de una bolsa
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreateOrUpdate(req: Request, res: Response): Promise<void> {
		try {
			const newItemsByRag: BagRecipeItem[] = req.body.items;
			const bagRecipeIdNew = req.body.id;
			const listOfFixedItems: BagRecipeItem[] = [];
			const bagRecipeService = new BagRecipeService();
			const bagRecipeItemService = new BagRecipeItemService();
			const productService = new ProductService();
			const inventoryStockService = new InventoryStockService();
			const inventoryMovementService = new InventoryMovementService();
			const userService = new UserService();
			const jwtService = new JWTService();

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
				let currentItemsByBag: BagRecipeItem[];
				//let currentItemsByBag: BagRecipeItem[];
				let isNew = false;

				// Get current items /* Esta como repetido abajo */
				currentItemsByBag = await bagRecipeItemService.listItemsByBagRecipeId(bagRecipeIdNew);

				//  If you do not get any item it is because the Recipe is new
				if (currentItemsByBag.length === 0) {
					isNew = true;
				}

				// Working to add items (Check if iyems exist)
				if (newItemsByRag.length > 0) {
					// Delete all items
					await bagRecipeItemService.remove(bagRecipeIdNew);

					// The new recipe items object is built
					newItemsByRag.forEach(async (i: any) => {
						const uItem = new BagRecipeItem();

						uItem.bagRecipe = bagRecipeIdNew;
						uItem.product = i.product.id
						uItem.quantity = (/,/.test(i.quantity)) ? i.quantity.replace(/,/g, '') : i.quantity;
						uItem.totalQuantityRequired = (/,/.test(i.totalQuantityRequired)) ? i.totalQuantityRequired.replace(/,/g, '') : i.totalQuantityRequired;
						uItem.costPrice = (/,/.test(i.costPrice)) ? i.costPrice.replace(/,/g, '') : i.costPrice;
						uItem.costPriceBs = (/,/.test(i.costPriceBs)) ? i.costPriceBs.replace(/,/g, '') : i.costPriceBs;
						uItem.totalCostPrice = (/,/.test(i.totalCostPrice)) ? i.totalCostPrice.replace(/,/g, '') : i.totalCostPrice;
						uItem.totalCostPriceBs = (/,/.test(i.totalCostPriceBs)) ? i.totalCostPriceBs.replace(/,/g, '') : i.totalCostPriceBs;
						uItem.salePrice = (/,/.test(i.salePrice)) ? i.salePrice.replace(/,/g, '') : i.salePrice;
						uItem.salePriceBs = (/,/.test(i.salePriceBs)) ? i.salePriceBs.replace(/,/g, '') : i.salePriceBs;
						uItem.totalSalePrice = (/,/.test(i.totalSalePrice)) ? i.totalSalePrice.replace(/,/g, '') : i.totalSalePrice;
						uItem.totalSalePriceBs = (/,/.test(i.totalSalePriceBs)) ? i.totalSalePriceBs.replace(/,/g, '') : i.totalSalePriceBs;
						uItem.freightAmount = (/,/.test(i.freightAmount)) ? i.freightAmount.replace(/,/g, '') : i.freightAmount;
						uItem.freightAmountBs = (/,/.test(i.freightAmountBs)) ? i.freightAmountBs.replace(/,/g, '') : i.freightAmountBs;
						uItem.totalFreightAmount = (/,/.test(i.totalFreightAmount)) ? i.totalFreightAmount.replace(/,/g, '') : i.totalFreightAmount;
						uItem.totalFreightAmountBs =  (/,/.test(i.totalFreightAmountBs)) ? i.totalFreightAmountBs.replace(/,/g, '') : i.totalFreightAmountBs;

						// Sanitize data
						sanitize(uItem);

						// Save on array
						listOfFixedItems.push(uItem);
					});
					console.log('Aqui los Items Sin Arreglar que se van a guardar en ctrlCreateOrUpdate', newItemsByRag)
					console.log('Aqui los Items Arreglados que se van a guardar en ctrlCreateOrUpdate', listOfFixedItems)
					// Save Changes by new items object
					const iremSaveTrue = await bagRecipeItemService.saveChanges(listOfFixedItems);

					// If it is new, new items already updated are recovered
					if (isNew) {
						currentItemsByBag = await bagRecipeItemService.listItemsByBagRecipeId(bagRecipeIdNew);
					}

					// Se verifica si se guardo el nuevo objeto (newItems) y si se obtuvo el objeto currentItemsByBag con sus datos actuales
					if (iremSaveTrue && currentItemsByBag) {
						currentItemsByBag.forEach(async (currentItem: { product: { name: any; id: any; }; totalQuantityRequired: number; bagRecipe: BagRecipe; }) => {
							try {
								// Se guarda el nombre actual del item.
								const currentItemName = currentItem.product.name;

								//  Se filtra el objeto newItems para excluir la BOLSA
								if (currentItemName != 'Bolsa') {
									const newItem = listOfFixedItems.find(nProd => Number(nProd.product) === Number(currentItem.product.id));
									if (newItem) {
										const inventoryMovement = new InventoryMovement();
										const currentInventoryStock = new InventoryStock();
										let verificationResult: string;

										const product = await productService.getOne(Number(newItem.product));

										// Se verifica si es un nuevo registro
										if (isNew) {
											verificationResult = 'equal'; // Es igual

											if (newItem.totalQuantityRequired != 0) {
												inventoryMovement.description = 'Salida de stock inventario: reducción y registro de productos retirados, disminuyendo la cantidad disponible';
												inventoryMovement.destination = 'Receta';
												inventoryMovement.guideNumber = bagRecipe.serialCode;
												inventoryMovement.quantity = newItem.totalQuantityRequired;
												inventoryMovement.movementType = MovementType.OUTPUT;
												inventoryMovement.responsibleUser = currentUser.firstName + ' ' + currentUser.lastName;
												//inventoryMovement.stockAfterMovement = Number(product.stock.quantity) - newItem.totalQuantityRequired;
												inventoryMovement.referenceType = 'BagRecipe';
												inventoryMovement.referenceId = currentItem.bagRecipe.serialCode;
												//inventoryMovement.inventoryStock = product.stock;
												inventoryMovement.date = getCurrentDate();

												// Se guarda el movimineto en Inventario Movimientos
												let resultInventoryMovement = await inventoryMovementService.saveChanges(inventoryMovement);
												//console.log('Resultado del movimiento', inventoryMovement.inventoryStock);

												// If the movement in the inventory is saved, if the stock of the products is updated
												if (resultInventoryMovement) {
													/* currentInventoryStock.id = inventoryMovement.inventoryStock.id;
													currentInventoryStock.quantity = Number(product.stock.quantity) - newItem.totalQuantityRequired; */

													// The stock of the product is updated after saving the movement
													await inventoryStockService.update(currentInventoryStock);
												}
											}
											// Si no es un producto nuevo, se verifica si la cantidad de producto requerida en los datos entrantes es MAYOR que la cantidad ya registrada en la base de datos.
										} else if (newItem.totalQuantityRequired > currentItem.totalQuantityRequired) {
											verificationResult = 'greater'; // Es mayor

											inventoryMovement.description = 'Salida de stock inventario: reducción y registro de productos retirados, disminuyendo la cantidad disponible';
											inventoryMovement.destination = 'Receta';
											inventoryMovement.guideNumber = bagRecipe.serialCode;
											inventoryMovement.quantity = newItem.totalQuantityRequired - currentItem.totalQuantityRequired;
											inventoryMovement.movementType = MovementType.OUTPUT;
											inventoryMovement.responsibleUser = currentUser.firstName + ' ' + currentUser.lastName;
											//inventoryMovement.stockAfterMovement = Number(product.stock.quantity) - (newItem.totalQuantityRequired - currentItem.totalQuantityRequired);
											inventoryMovement.referenceType = 'BagRecipe';
											inventoryMovement.referenceId = currentItem.bagRecipe.serialCode;
											//inventoryMovement.inventoryStock = product.stock;
											inventoryMovement.date = getCurrentDate();

											// Se guarda el movimineto en Stock Movimiento
											let resultInventoryMovement = await inventoryMovementService.saveChanges(inventoryMovement);
											//console.log('Resultado del movimiento', inventoryMovement.inventoryStock);

											if (resultInventoryMovement) {
												/* currentInventoryStock.id = inventoryMovement.inventoryStock.id;
												currentInventoryStock.quantity = Number(product.stock.quantity) - (newItem.totalQuantityRequired - currentItem.totalQuantityRequired);
 */
												// The stock of the product is updated after saving the movement
												await inventoryStockService.update(currentInventoryStock);
											}

											// Si no es un producto nuevo, se verifica si la cantidad de producto requerida en los datos entrantes es MENOR que la cantidad ya registrada en la base de datos.
										} else if (newItem.totalQuantityRequired < currentItem.totalQuantityRequired) {
											verificationResult = 'lesser'; // Es menor

											inventoryMovement.description = 'Devolución de stock al inventario: proceso de registrar y restituir productos que han sido retornados, ajustando y aumentando la cantidad disponible en el inventario.';
											inventoryMovement.destination = 'Receta';
											inventoryMovement.guideNumber = bagRecipe.serialCode;
											inventoryMovement.quantity = (newItem.totalQuantityRequired != 0) ? currentItem.totalQuantityRequired - newItem.totalQuantityRequired : currentItem.totalQuantityRequired;
											inventoryMovement.movementType = MovementType.RETURN;
											inventoryMovement.responsibleUser = currentUser.firstName + ' ' + currentUser.lastName;
											//inventoryMovement.stockAfterMovement = Number(product.stock.quantity) + ((newItem.totalQuantityRequired != 0) ? currentItem.totalQuantityRequired - newItem.totalQuantityRequired : currentItem.totalQuantityRequired);
											inventoryMovement.referenceType = 'BagRecipe';
											inventoryMovement.referenceId = currentItem.bagRecipe.serialCode;
											//inventoryMovement.inventoryStock = product.stock;
											inventoryMovement.date = getCurrentDate();

											// Se guarda el movimineto en Stock Movimiento
											let resultInventoryMovement = await inventoryMovementService.saveChanges(inventoryMovement);
											//console.log('Resultado del movimiento', inventoryMovement.inventoryStock);

											if (resultInventoryMovement) {
												/* currentInventoryStock.id = inventoryMovement.inventoryStock.id;
												currentInventoryStock.quantity = Number(product.stock.quantity) + ((newItem.totalQuantityRequired != 0) ? currentItem.totalQuantityRequired - newItem.totalQuantityRequired : currentItem.totalQuantityRequired);
 */
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
	 * Remueve los items de una Bolsa
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeService = new BagRecipeService();
			const bagRecipeItemService = new BagRecipeItemService();

			// Find recipe
			const bagRecipe: BagRecipe = await bagRecipeService.getOneOnlyObject(req.body.id);

			if (bagRecipe) {
				// Delete all Items
				await bagRecipeItemService.remove(bagRecipe.id);

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
