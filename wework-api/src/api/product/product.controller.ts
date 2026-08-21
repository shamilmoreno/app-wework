import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { Product } from '../../database/entities/product';
import { Inventory } from '../../database/entities/inventory';
import { ProductDetailModel } from '../../core/models/bag-recipe-product.model';
import { ProductService } from '../../core/services/product.service';
import { InventoryStockService } from '../../core/services/inventory-stock.service';
import { NotificationMiddleware } from '../../core/middlewares/notification.middleware';
import { HttpResponseService } from '../../core/services/http-response.service';
import { getCurrentDate } from '../../core/helpers/str-utils';
import { BagRecipeDetailModel } from '../../core/models/bag-recipe-detail';
import { validate } from 'class-validator';
import moment from 'moment';
import { InventoryMovementService } from '../../core/services/inventory-movement.service';
import { InventoryMovement } from '../../database/entities/inventory-movement';
import { User } from '../../database/entities/user';
import { JWTService } from '../../core/services/jwt.service';
import { UserService } from '../../core/services/user.service';
import { MovementType } from '../../core/enums/movement-type.enum';

export class ProductController {
	/**
	* Carga todos las productos de la base de datos
	* @param req Solicitud
	* @param res Respuesta
	*/
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const productController = new ProductController();
			const productService = new ProductService();
			const products: Product[] = await productService.list();
			console.log('Estos sonlos productos en list product', products);

			//await productController.getStructureBagRecipe(products);

			HttpResponseService.response(res, 200, products, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar Productos por Id
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOne(req: Request, res: Response): Promise<void> {
		try {
			const productService = new ProductService();
			const productList: { id: any; name: any; bagRecipeId: any; productQuantity: any; quantityProductRequired: any; priceProduct: any; priceSale: any; totalCostPrice: any; totalSalePrice: any; amountMaquilador: any; amountPaciscor: any; amountDollarsMaquilador: any; amountDollarsPaciscor: any; amountFreightForProduct: any; totalFreightForProduct: any; }[] = [];
			let bagRecipeUpdate: BagRecipeDetailModel = {
				id: 0,
				monthRecipeBag: '',
				numberBags: 0,
				maquiladorBag: '',
				products: [],
				payments: [],
				surcharges: {}
			};

			// Find Product
			const product: Product = await productService.getOne(parseInt(req.params.id));

			/* product.products.forEach((p: any) => {
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
					amountMaquilador: p.amountMaquilador,
					amountPaciscor: p.amountPaciscor,
					amountDollarsMaquilador: p.amountDollarsMaquilador,
					amountDollarsPaciscor: p.amountDollarsPaciscor,
					amountFreightForProduct: p.amountFreightForProduct,
					totalFreightForProduct: p.totalFreightForProduct
				});
			});

			bagRecipeUpdate = {
				id: product.id,
				monthRecipeBag: product.monthRecipeBag,
				numberBags: product.numberBags,
				maquiladorBag: product.maquiladorBag,
				surcharges: product.surcharges,
				products: productList,
				payments: product.payments
			}; */

			// Valid the info
			if (bagRecipeUpdate) {
				HttpResponseService.response(res, 200, bagRecipeUpdate, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	* Cargar detalle del producto
	* @param req Solicitud
	* @param res Respuesta
	*/
	public async ctrlGetOneForDetail(req: Request, res: Response): Promise<void> {
		try {
			const productService = new ProductService();
			const productController = new ProductController();
			let productDetail: ProductDetailModel = {};

			// Find Product
			const product: Product = await productService.getOneForDetail(parseInt(req.params.id));

			// Build the info
			//productDetail = await productController.getStructureProduct(product);

			// Valid the info
			if (product) {
				HttpResponseService.response(res, 200, productDetail, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.product.productNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crea una nuevo producto
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreate(req: Request, res: Response): Promise<void> {
		try {
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

			// Creating a instance of Product
			const product = new Product();
			product.sku = req.body.sku.toUpperCase();
			product.name = req.body.name;
			product.imageUrl = '/resources/default.png';
			/* product.location = req.body.location; */
			product.unitMeasurec = req.body.unitMeasurec;
			product.createdAt = getCurrentDate()

			// Validate data Product
			const productErros = await validate(product);
			if (productErros.length > 0) {
				//HttpResponseService.response(res, 400, productErros, messages.general.error);
			}

			// Sanitize data
			sanitize(product);

			// Save Changes
			let newpPoduct = new Product();
			newpPoduct = await productService.saveChanges(product);

			// Save data new product in Inventory Stock
			if (newpPoduct) {
				const productInventoryStock = new Inventory();
				let currentInventoryStock = new Inventory();
				productInventoryStock.product = newpPoduct;
				productInventoryStock.quantityProductStock = 0;
				productInventoryStock.createdAt = getCurrentDate();
				currentInventoryStock = await inventoryStockService.saveChanges(productInventoryStock);

				if (currentInventoryStock) {
					const inventoryMovement = new InventoryMovement();
					inventoryMovement.guideNumber = 'Registro Inicial';
					inventoryMovement.quantityProductMoved = 0;
					inventoryMovement.date = getCurrentDate();
					inventoryMovement.destination = 'Apertura de Stock';
					inventoryMovement.description = '"Registro inicial del producto nuevo en inventario con stock asignado en 0 unidades disponibles';
					inventoryMovement.responsibleUser = currentUser.firstName + ' ' + currentUser.lastName;
					inventoryMovement.stockAfterMovement = 0;
					inventoryMovement.movementType = MovementType.RETURN;
					inventoryMovement.createdAt = getCurrentDate();
					//inventoryMovement.bagRecipe = null
					inventoryMovement.inventoryStock = currentInventoryStock;

					inventoryMovementService.saveChanges(inventoryMovement);
				}
			}
			HttpResponseService.response(res, 200, newpPoduct, messages.product.productCreated);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Actualiza un Producto
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlUpdate(req: Request, res: Response): Promise<void> {
		try {
			const productService = new ProductService();

			// Search procedure
			const product: Product = await productService.getOne(req.body.id);
			if (product) {
				product.sku = req.body.sku;
				product.name = req.body.name;
				/* product.location = req.body.location; */

				// Validate data Product
				const productErros = await validate(product);
				if (productErros.length > 0) {
					HttpResponseService.response(res, 400, productErros, messages.general.error);
				}

				// Sanitize data
				sanitize(product);

				// Save Changes
				const result = await productService.saveChanges(product);
				HttpResponseService.response(res, 200, result, messages.product.productUpdated);
			} else {
				HttpResponseService.response(res, 404, '', messages.product.productNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Elimina un Producto
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const productService = new ProductService();
			const notificationMiddleware = new NotificationMiddleware();
			const product: Product = await productService.getOne(parseInt(req.params.id));

			if (product) {
				const data = await productService.remove(parseInt(req.params.id));
				if (data.affected > 0) {
					HttpResponseService.response(res, 200, null, messages.product.productDeleted);
				} else {
					HttpResponseService.response(res, 401, null, messages.general.error);
				}
			} else {
				HttpResponseService.response(res, 404, null, messages.product.productNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Genera la estructura de los datos
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async getStructureProduct(products: any) {
		try {
			/* let bagRecipesDetail: ProductDetailModel = {};
			let sumProductForBag: number = 0.00;
			let sumUnitCostPrice: number = 0.00;
			let sumUnitSalePrice: number = 0.00;
			let sumTotalCostPrice: number = 0.00;
			let sumTotalSalePrice: number = 0.00;
			let valueAmountMaquilador: number = 0;
			let valueAmountPaciscor: number = 0;
			let valueAmountDollarsMaquilador: number = 0.00;
			let valueAmountDollarsPaciscor: number = 0.00;
			let valueTotalNumberBags: number = 0;
			let valueComboUtility: number = 0.00;
			let sumFreightForProduct: number = 0.00;
			let valueProductMaquilador: any = [];
			let valueProductPaciscor: any = [];

			products.products.forEach((p: any) => {
				sumProductForBag += (p.product.name !== 'Armado' && p.product.name !== 'Bolsa') ? Number(p.productQuantity) : 0;
				sumUnitCostPrice += (Number(p.priceProduct) * Number(p.productQuantity));
				sumTotalCostPrice += Number(p.totalCostPrice);
				sumUnitSalePrice += (Number(p.priceSale) * Number(p.productQuantity));
				sumTotalSalePrice += Number(p.totalSalePrice);
				valueAmountMaquilador += Number(p.amountMaquilador);
				valueAmountPaciscor += Number(p.amountPaciscor);
				if (Number(p.amountMaquilador) > 0) {
					valueProductMaquilador.push({ name: p.product.name, quantity: p.amountMaquilador })
				} else if (Number(p.amountPaciscor) > 0) {
					valueProductPaciscor.push({ name: p.product.name, quantity: p.amountPaciscor })
				}
				valueAmountDollarsMaquilador += Number(p.amountDollarsMaquilador);
				valueAmountDollarsPaciscor += Number(p.amountDollarsPaciscor);
				valueTotalNumberBags = bagRecipes.numberBags;
				sumFreightForProduct += Number(p.totalFreightForProduct);
				valueComboUtility = sumUnitSalePrice - Number(sumUnitCostPrice);
			});
			bagRecipesDetail = {
				id: bagRecipes.id,
				monthRecipe: moment(bagRecipes.monthRecipeBag).format('MMMM YYYY'),
				maquiladorBag: bagRecipes.maquiladorBag,
				numberBags: valueTotalNumberBags,
				productForBag: sumProductForBag,
				bagAtCostPrice: sumUnitCostPrice,
				bagAtSalesPrice: sumUnitSalePrice,
				amountMaquilador: valueAmountMaquilador,
				amountPaciscor: valueAmountPaciscor,
				amountDollarsMaquilador: valueAmountDollarsMaquilador,
				amountDollarsPaciscor: valueAmountDollarsPaciscor,
				infoProductMaquilador: valueProductMaquilador,
				infoProductPaciscor: valueProductPaciscor,
				totalPriceCost: sumTotalCostPrice,
				totalSalePrice: sumTotalSalePrice,
				totalFreightForProduct: sumFreightForProduct,
				products: bagRecipes.products,
				payments: bagRecipes.payments
			}; */
			//return bagRecipesDetail;
		} catch (error) {
			console.log(error);
		}

	}
}
