import { sanitize } from "class-sanitizer";
import { Request, Response } from "express";
import messages from "../../core/helpers/messages";
import { BagRecipe } from "../../database/entities/bag-recipe";
import { ProductDetailModel } from "../../core/models/bag-recipe-product.model";
import { BagRecipeService } from "../../core/services/bag-recipe.service";
import { NotificationMiddleware } from "../../core/middlewares/notification.middleware";
import { HttpResponseService } from "../../core/services/http-response.service";
import { getCurrentDate } from "../../core/helpers/str-utils";
import { BagRecipeDetailModel } from "../../core/models/bag-recipe-detail";
import { validate } from "class-validator";
import moment from "moment";
import { BagRecipeProductService } from "../../core/services/bag-recipe-product.service";
import { InventoryStockService } from "../../core/services/inventory-stock.service";
import { InventoryMovement } from "../../database/entities/inventory-movement";
import { User } from "../../database/entities/user";
import { UserService } from "../../core/services/user.service";
import { JWTService } from "../../core/services/jwt.service";
import { Inventory } from "../../database/entities/inventory";
import { InventoryMovementService } from "../../core/services/inventory-movement.service";
import { BagRecipeDto } from "../../core/dto/bag-recipe.dto";
import { plainToInstance } from "class-transformer";
import { MovementType } from '../../core/enums/movement-type.enum';

export class BagRecipeController {
	/**
	 * Carga todos las recetas de la base de datos
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeController = new BagRecipeController();
			const bagRecipeService = new BagRecipeService();
			const bagRecipes: BagRecipe[] = await bagRecipeService.list();

			await bagRecipeController.getStructureBagRecipe(bagRecipes);

			HttpResponseService.response(res, 200, bagRecipes, "");
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar Receta por Id
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOne(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeService = new BagRecipeService();
			const productList: {
				id: any;
				name: any;
				bagRecipeId: any;
				productQuantity: any;
				quantityProductRequired: any;
				priceProduct: any;
				priceSale: any;
				totalCostPrice: any;
				totalSalePrice: any;
				amountMaquiladorMajor: any;
				amountMaquiladorCooperator: any;
				amountDollarsMaquiladorMajor: any;
				amountDollarsMaquiladorCooperator: any;
				amountFreightForProduct: any;
				currentProductStock: any;
				totalFreightForProduct: any;
			}[] = [];
			let bagRecipeUpdate: BagRecipeDetailModel = {
				id: 0,
				monthRecipeBag: "",
				numberBags: 0,
				maquiladorBag: "",
				operatingExpense: 0.0,
				maquila: 0.0,
				tax: 0.0,
				commission: 0.0,
				maquiladors: [],
				products: [],
				payments: [],
				surcharges: {},
			};

			// Find Bag Receta
			const bagRecipe: BagRecipe = await bagRecipeService.getOne(
				parseInt(req.params.id)
			);

			bagRecipe.products.forEach((p: any) => {
				productList.push({
					id: p.product.id,
					name: p.product.name,
					bagRecipeId: p.id,
					productQuantity: p.productQuantity,
					quantityProductRequired: p.quantityProductRequired,
					priceProduct: p.priceProduct,
					priceSale: p.priceSale,
					totalCostPrice: p.totalCostPrice,
					totalSalePrice: p.totalSalePrice,
					amountMaquiladorMajor: p.amountMaquiladorMajor,
					amountMaquiladorCooperator: p.amountMaquiladorCooperator,
					amountDollarsMaquiladorMajor: p.amountDollarsMaquiladorMajor,
					amountDollarsMaquiladorCooperator: p.amountDollarsMaquiladorCooperator,
					amountFreightForProduct: p.amountFreightForProduct,
					totalFreightForProduct: p.totalFreightForProduct,
					currentProductStock: p.product.stock ? p.product.stock.quantityProductStock : 0,
				});
			});

			bagRecipeUpdate = {
				id: bagRecipe.id,
				serialCode: bagRecipe.serialCode,
				monthRecipeBag: bagRecipe.monthRecipeBag,
				numberBags: bagRecipe.numberBags,
				operatingExpense: bagRecipe.operatingExpense,
				maquila: bagRecipe.maquila,
				tax: bagRecipe.tax,
				commission: bagRecipe.commission,
				maquiladors: bagRecipe.maquiladors,
				products: productList,
				payments: bagRecipe.payments,
			};
			//console.log("Es el objeto del bagRecipeUpdate en la base de Datos en el Get One", bagRecipeUpdate);
			// Valid the info
			if (bagRecipeUpdate) {
				HttpResponseService.response(res, 200, bagRecipeUpdate, "");
			} else {
				HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar detalle de la Receta
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOneForDetail(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeService = new BagRecipeService();
			const bagRecipeController = new BagRecipeController();
			let bagRecipesDetail: ProductDetailModel = {};

			// Find Bag Recipe
			const bagRecipe: BagRecipe = await bagRecipeService.getOneForDetail(parseInt(req.params.id));

			// Filtrar los productos donde productQuantity > 0
			const filteredProducts = bagRecipe.products.filter((product) => product.productQuantity > 0);

			// Crear una copia del objeto bagRecipe con los productos filtrados
			const filteredBagRecipe = {
				...bagRecipe,
				products: filteredProducts,
			};

			// Build the info
			bagRecipesDetail = await bagRecipeController.getStructureBagRecipe(filteredBagRecipe);

			// Valid the info
			if (bagRecipe) {
				HttpResponseService.response(res, 200, bagRecipesDetail, "");
			} else {
				HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crea una nueva receta
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreate(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeService = new BagRecipeService();

			// Creating a instance of Bag Recipe
			const bagRecipe = new BagRecipe();
			bagRecipe.monthRecipeBag = req.body.monthRecipeBag;
			bagRecipe.numberBags = Number(/,/.test(req.body.numberBags) ? req.body.numberBags.replace(/,/g, "") : req.body.numberBags);
			bagRecipe.operatingExpense = Number(/,/.test(req.body.operatingExpense) ? req.body.operatingExpense.replace(/,/g, "") : req.body.operatingExpense);
			bagRecipe.maquila = Number(/,/.test(req.body.maquila) ? req.body.maquila.replace(/,/g, "") : req.body.maquila);
			bagRecipe.tax = Number(/,/.test(req.body.tax) ? req.body.tax.replace(/,/g, "") : req.body.tax);
			bagRecipe.commission = Number(/,/.test(req.body.commission) ? req.body.commission.replace(/,/g, "") : req.body.commission);
			bagRecipe.createdAt = getCurrentDate();

			// Validar los datos entrantes con DTO
			const dto = plainToInstance(BagRecipeDto, bagRecipe);
			const bahRecipeErros = await validate(dto);

			if (bahRecipeErros.length > 0) {
				HttpResponseService.response(res, 400, bahRecipeErros, messages.general.error);
				return;
			}

			// Sanitize data
			sanitize(bagRecipe);

			// Save Changes
			const result = await bagRecipeService.saveChanges(bagRecipe);
			HttpResponseService.response(res, 200, result, messages.bagRecipe.bagRecipeCreated);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Actualiza una Receta
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlUpdate(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeService = new BagRecipeService();

			// Search procedure
			const bagRecipe: BagRecipe = await bagRecipeService.getOne(req.body.id);
			if (bagRecipe) {
				bagRecipe.monthRecipeBag = req.body.monthRecipeBag;
				bagRecipe.numberBags = Number(/,/.test(req.body.numberBags) ? req.body.numberBags.replace(/,/g, "") : req.body.numberBags);
				bagRecipe.operatingExpense = Number(/,/.test(req.body.operatingExpense) ? req.body.operatingExpense.replace(/,/g, "") : req.body.operatingExpense);
				bagRecipe.maquila = Number(/,/.test(req.body.maquila) ? req.body.maquila.replace(/,/g, "") : req.body.maquila);
				bagRecipe.tax = Number(/,/.test(req.body.tax) ? req.body.tax.replace(/,/g, "") : req.body.tax);
				bagRecipe.commission = Number(/,/.test(req.body.commission) ? req.body.commission.replace(/,/g, "") : req.body.commission);

				// Validar los datos entrantes con DTO
				const dto = plainToInstance(BagRecipeDto, bagRecipe);
				const bahRecipeErros = await validate(dto);

				if (bahRecipeErros.length > 0) {
					HttpResponseService.response(res, 400, bahRecipeErros, messages.general.error);
					return;
				}

				// Sanitize data
				sanitize(bagRecipe);

				// Save Changes
				const result = await bagRecipeService.saveChanges(bagRecipe);
				HttpResponseService.response(res, 200, result, messages.bagRecipe.bagRecipeUpdated);
			} else {
				HttpResponseService.response(res, 404, "", messages.bagRecipe.bagRecipeNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Elimina una Reseta
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeService = new BagRecipeService();
			const notificationMiddleware = new NotificationMiddleware();
			const bagRecipe: BagRecipe = await bagRecipeService.getOne(
				parseInt(req.params.id)
			);

			if (bagRecipe) {
				const data = await bagRecipeService.remove(parseInt(req.params.id));
				if (data.affected > 0) {
					HttpResponseService.response(res, 200, null, messages.bagRecipe.bagRecipeDeleted);
				} else {
					HttpResponseService.response(res, 401, null, messages.general.error);
				}
			} else {
				HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Inactuvar una Receta
	 * @param req
	 * @param res
	 */
	public async ctrlSetInactive(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeService = new BagRecipeService();
			const bagRecipeProductService = new BagRecipeProductService();
			const inventoryStockService = new InventoryStockService();
			const inventoryMovementService = new InventoryMovementService();
			const notificationMiddleware = new NotificationMiddleware();
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
			const bagRecipe: BagRecipe = await bagRecipeService.getOne(
				parseInt(req.body.id)
			);

			if (bagRecipe) {
				bagRecipe.isActive = false;
				const data = await bagRecipeService.update(bagRecipe);
				if (data) {
					if (bagRecipe.products) {
						bagRecipe.products.forEach(async (currentProduct) => {
							console.log('Por aca el producto actual en desactivar receta', currentProduct);
							const productName = currentProduct.product.name;
							const inventoryMovement = new InventoryMovement();
							if (productName != "Bolsa") {
								const inventoryStock: Inventory = await inventoryStockService.getOneByProductId(currentProduct.product.id);
								inventoryStock.quantityProductStock += currentProduct.quantityProductRequired;
								inventoryMovement.description = "Devolución de stock al inventario: proceso de restituir productos que han sido retornados por eliminación de Receta, ajustando y aumentando la cantidad disponible en el inventario.";
								inventoryMovement.destination = "Receta";
								inventoryMovement.guideNumber = bagRecipe.serialCode;
								inventoryMovement.quantityProductMoved = currentProduct.quantityProductRequired;
								inventoryMovement.movementType = MovementType.RETURN;
								inventoryMovement.responsibleUser = currentUser.firstName + " " + currentUser.lastName;
								inventoryMovement.stockAfterMovement = currentProduct.quantityProductRequired;
								inventoryMovement.referenceType = 'BagRecipe';
								inventoryMovement.referenceId = bagRecipe.serialCode;
								inventoryMovement.inventoryStock = inventoryStock;
								inventoryMovement.date = getCurrentDate();
								inventoryMovement.createdAt = getCurrentDate();

								// Se guarda la devolucion en Stock
								console.log("Es el Recipe de la Actual Receta", bagRecipe.id);
								console.log("Es el movimiento de stock que se va a devolver al stock", inventoryMovement);
								await inventoryStockService.saveChanges(inventoryStock);
								// Se guarda el movimineto en Stock Movimiento
								if (inventoryMovement.quantityProductMoved > 0) {
									await inventoryMovementService.saveChanges(inventoryMovement);
								}
							}
						});
					}
					HttpResponseService.response(res, 200, null, messages.bagRecipe.bagRecipeDeleted);
				} else {
					HttpResponseService.response(res, 401, null, messages.general.error);
				}
			} else {
				HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	public async getStructureBagRecipe(bagRecipes: any) {
		try {
			// Desestructuración de bagRecipes
			const {
				products = [],
				numberBags = 0,
				id,
				serialCode,
				monthRecipeBag,
				operatingExpense,
				maquila,
				tax,
				commission,
				payments,
				maquiladors,
			} = bagRecipes;

			// Inicialización de acumuladores
			const initialValues = {
				sumProductForBag: 0.0,
				sumUnitCostPrice: 0.0,
				sumUnitSalePrice: 0.0,
				sumTotalCostPrice: 0.0,
				sumTotalSalePrice: 0.0,
				valueAmountMaquiladorMajor: 0,
				valueAmountMaquiladorCooperator: 0,
				valueAmountDollarsMaquiladorMajor: 0.0,
				valueAmountDollarsMaquiladorCooperator: 0.0,
				sumFreightForProduct: 0.0,
				valueProductMaquiladorMajor: [] as any[],
				valueProductMaquiladorCooperator: [] as any[],
				valueComboUtility: 0.0,
				valueProductStock: 0,
			};

			const {
				sumProductForBag,
				sumUnitCostPrice,
				sumUnitSalePrice,
				sumTotalCostPrice,
				sumTotalSalePrice,
				valueAmountMaquiladorMajor,
				valueAmountMaquiladorCooperator,
				valueAmountDollarsMaquiladorMajor,
				valueAmountDollarsMaquiladorCooperator,
				sumFreightForProduct,
				valueProductMaquiladorMajor,
				valueProductMaquiladorCooperator,
				valueComboUtility,
				valueProductStock,
			} = products.reduce((acc: any, p: any) => {
				const quantity = Number(p.productQuantity);
				const priceProduct = Number(p.priceProduct);
				const priceSale = Number(p.priceSale);
				const totalCostPrice = Number(p.totalCostPrice);
				const totalSalePrice = Number(p.totalSalePrice);
				const amountMaquiladorMajor = Number(p.amountMaquiladorMajor);
				const amountMauiladorCooperator = Number(p.amountMaquiladorCooperator);
				const amountDollarsMaquiladorMajor = Number(p.amountDollarsMaquiladorMajor);
				const amountDollarsMaquiladorCooperator = Number(p.valueAmountDollarsMaquiladorCooperator);
				const totalFreightForProduct = Number(p.totalFreightForProduct);

				return {
					sumProductForBag: acc.sumProductForBag + (p.product.name !== "Bolsa" ? quantity : 0),
					sumUnitCostPrice: acc.sumUnitCostPrice + priceProduct * quantity,
					sumTotalCostPrice: acc.sumTotalCostPrice + totalCostPrice,
					sumUnitSalePrice: acc.sumUnitSalePrice + priceSale * quantity,
					sumTotalSalePrice: acc.sumTotalSalePrice + totalSalePrice,
					valueAmountMaquiladorMajor: acc.valueAmountMaquiladorMajor + amountMaquiladorMajor,
					valueAmountMaquiladorCooperator: acc.valueAmountMaquiladorCooperator + amountMauiladorCooperator,
					valueAmountDollarsMaquiladorMajor: acc.valueAmountDollarsMaquiladorMajor + amountDollarsMaquiladorMajor,
					valueAmountDollarsMaquiladorCooperator: acc.valueAmountDollarsMaquiladorCooperator + amountDollarsMaquiladorCooperator,
					sumFreightForProduct: acc.sumFreightForProduct + totalFreightForProduct,
					valueProductMaquiladorMajor: amountMaquiladorMajor > 0 ?
						[
							...acc.valueProductMaquiladorMajor,
							{ name: p.product.name, quantity: amountMaquiladorMajor },
						] : acc.valueProductMaquiladorMajor,
					valueProductMaquiladorCooperator: amountMauiladorCooperator > 0 ?
						[
							...acc.valueProductMaquiladorCooperator,
							{ name: p.product.name, quantity: amountMauiladorCooperator },
						]
						: acc.valueProductMaquiladorCooperator,
					valueProductStock: p.product.stock,
					valueComboUtility: acc.sumUnitSalePrice - acc.sumUnitCostPrice,
				};
			}, initialValues);

			const bagRecipesDetail: ProductDetailModel = {
				id,
				serialCode,
				monthRecipe: moment(monthRecipeBag).format("MMMM YYYY"),
				numberBags,
				operatingExpense,
				maquila,
				tax,
				commission,
				productForBag: sumProductForBag,
				bagAtCostPrice: sumUnitCostPrice,
				bagAtSalesPrice: sumUnitSalePrice,
				amountMaquiladorMajor: valueAmountMaquiladorMajor,
				amountMaquiladorCooperator: valueAmountMaquiladorCooperator,
				amountDollarsMaquiladorMajor: valueAmountDollarsMaquiladorMajor,
				amountDollarsMaquiladorCooperator: valueAmountDollarsMaquiladorCooperator,
				infoProductMaquiladorMajor: valueProductMaquiladorMajor,
				infoProductMaquiladorCooperator: valueProductMaquiladorCooperator,
				totalPriceCost: sumTotalCostPrice,
				totalSalePrice: sumTotalSalePrice,
				totalFreightForProduct: sumFreightForProduct,
				maquiladors,
				products,
				payments,
			};
			return bagRecipesDetail;
		} catch (error) {
			console.log(error);
			throw new Error("An error occurred while processing the bag recipes");
		}
	}
}
