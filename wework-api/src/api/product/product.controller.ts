import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { Product } from '../../database/entities/product';
import { InventoryStock } from '../../database/entities/inventory-stock ';
import { ProductService } from '../../core/services/product.service';
import { InventoryStockService } from '../../core/services/inventory-stock.service';
import { NotificationMiddleware } from '../../core/middlewares/notification.middleware';
import { HttpResponseService } from '../../core/services/http-response.service';
import { getCurrentDate } from '../../core/helpers/str-utils';
import { validate } from 'class-validator';
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
			const productList: Product[] = await productService.list();

			const products = await productController.getStructureListProduct(productList);

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

			// Find Product
			const product: Product = await productService.getOne(parseInt(req.params.id));

			// Valid the info
			if (product) {
				HttpResponseService.response(res, 200, product, '');
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

			// Find Product
			const product: Product = await productService.getOneForDetail(parseInt(req.params.id));

			// Build the info
			//productDetail = await productController.getStructureProduct(product);

			// Valid the info
			if (product) {
				HttpResponseService.response(res, 200, product, '');
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
				const productInventoryStock = new InventoryStock();
				let currentInventoryStock = new InventoryStock();
				productInventoryStock.product = newpPoduct;
				productInventoryStock.quantity = 0;
				currentInventoryStock = await inventoryStockService.saveChanges(productInventoryStock);

				if (currentInventoryStock) {
					const inventoryMovement = new InventoryMovement();
					inventoryMovement.guideNumber = 'Registro Inicial';
					inventoryMovement.quantity = 0;
					inventoryMovement.date = getCurrentDate();
					inventoryMovement.destination = 'Apertura de Stock';
					inventoryMovement.description = '"Registro inicial del producto nuevo en inventario con stock asignado en 0 unidades disponibles';
					inventoryMovement.responsibleUser = currentUser.firstName + ' ' + currentUser.lastName;
					inventoryMovement.stockAfterMovement = 0;
					inventoryMovement.movementType = MovementType.RETURN;
					//inventoryMovement.bagRecipe = null
					//inventoryMovement.inventoryStock = currentInventoryStock;

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
	public async getStructureListProduct(productList: any) {
		try {
			const products = productList.map((p: Product) => ({
				id: p.id,
				sku: p.sku,
				name: p.name,
				imageUrl: p.imageUrl,
				baseUnit: p.baseUnit,
				unitQuantity: p.unitQuantity,
				stock: p.stock?.[0] ?? null,
				unitMeasurec: p.unitMeasurec,
				isActive: p.isActive,
				createdAt: p.createdAt,
				updatedAt: p.updatedAt
			}));
			
			return products;
		} catch (error) {
			console.log(error);
		}

	}
}
