import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { Inventory } from '../../database/entities/inventory';
import { InventoryMovement } from '../../database/entities/inventory-movement';
import { InventoryMovementService } from '../../core/services/inventory-movement.service';
import { NotificationMiddleware } from '../../core/middlewares/notification.middleware';
import { HttpResponseService } from '../../core/services/http-response.service';
import { getCurrentDate } from '../../core/helpers/str-utils';
import { validate } from 'class-validator';
import moment from 'moment';
import { InventoryStockService } from '../../core/services/inventory-stock.service';
import { MovementType } from '../../core/enums/movement-type.enum';

export class InventoryMovementController {
	/**
	* Carga todos los stock de los productos en inventario de la base de datos
	* @param req Solicitud
	* @param res Respuesta
	*/
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const inventoryMovementService = new InventoryMovementService();
			const inventoryMovement: InventoryMovement[] = await inventoryMovementService.list();

			HttpResponseService.response(res, 200, inventoryMovement, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar stock de los productos por Id
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOne(req: Request, res: Response): Promise<void> {
		try {
			const inventoryMovementService = new InventoryMovementService();

			// Find stock products
			const inventoryMovement: InventoryMovement = await inventoryMovementService.getOne(parseInt(req.params.id));

			// Valid the info
			if (inventoryMovement) {
				HttpResponseService.response(res, 200, inventoryMovement, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crea un nuevo ingreso movimiento de inventario
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	/* public async ctrlCreate(req: Request, res: Response): Promise<void> {
		try {
			const inventoryMovementService = new InventoryMovementService();
			const inventoryStockServices = new InventoryStockService();

			let currentInventoryStock = await inventoryStockServices.getOne(req.body.inventoryStockId);

			console.log('Aca presento el req.body al guardar un inventario', req.body);
			
			// Creating a instance of stock producs
			const inventoryMovement = new InventoryMovement();
			inventoryMovement.guideNumber = req.body.guideNumber.toUpperCase(),
			inventoryMovement.quantityProductMoved = (/,/.test(req.body.quantityProductMoved)) ? req.body.quantityProductMoved.replace(/,/g, '') : req.body.quantityProductMoved,
			inventoryMovement.date = req.body.date,
			inventoryMovement.destination = req.body.destination,
			inventoryMovement.description = req.body.description,
			inventoryMovement.responsibleUser = req.body.responsibleUser,
			inventoryMovement.stockAfterMovement = currentInventoryStock.quantityProductStock + Number((/,/.test(req.body.quantityProductMoved)) ? req.body.quantityProductMoved.replace(/,/g, '') : req.body.quantityProductMoved),
			inventoryMovement.movementType = req.body.movementType,
			inventoryMovement.referenceId = req.body.referenceId,
			inventoryMovement.referenceType = req.body.referenceType,
			inventoryMovement.inventoryStock = req.body.inventoryStockId,
			inventoryMovement.createdAt = getCurrentDate()

			// Validate data stock products
			const inventoryMovementErros = await validate(inventoryMovement);
			if (inventoryMovementErros.length > 0) {
				HttpResponseService.response(res, 400, inventoryMovementErros, messages.general.error);
			}

			// Sanitize data
			sanitize(inventoryMovement);

			// Save Changes
			const result = await inventoryMovementService.saveChanges(inventoryMovement);
			const inventoryStock: Inventory = await inventoryStockServices.getOne(req.body.inventoryStockId);
			let quantity: any = inventoryMovement.quantityProductMoved

			if (inventoryStock) {
				inventoryStock.quantityProductStock += (/,/.test(quantity)) ? Number(quantity.replace(/,/g, '')) : Number(quantity) ;
			}
			
			await inventoryStockServices.saveChanges(inventoryStock);

			HttpResponseService.response(res, 200, result, messages.inventoryStock.inventoryStockCreated);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	} */

	public async ctrlCreate(req: Request, res: Response): Promise<void> {
		try {
			const inventoryMovementService = new InventoryMovementService();
			const inventoryStockServices = new InventoryStockService();

			const guideNumber = req.body.guideNumber?.toUpperCase();
			const date = req.body.date;

			// Asegurar que siempre trabajamos con un array
			const productMovements = Array.isArray(req.body.products) ? req.body.products : [req.body.products];

			const savedMovements: any[] = [];

			for (const product of productMovements) {
				// Obtener el inventario actual
				let currentInventoryStock = await inventoryStockServices.getOne(product.inventoryStockId);
				if (!currentInventoryStock) {
					continue; // o puedes lanzar un error si es crítico
				}

				// Crear movimiento
				const movement = new InventoryMovement();
				movement.guideNumber = guideNumber;
				movement.quantityProductMoved = /,/.test(product.quantityProductMoved) ? product.quantityProductMoved.replace(/,/g, '') : product.quantityProductMoved;
				movement.date = date;
				movement.destination = product.destination;
				movement.description = product.description;
				movement.responsibleUser = product.responsibleUser;
				movement.stockAfterMovement = currentInventoryStock.quantityProductStock + Number(movement.quantityProductMoved);
				movement.movementType = MovementType.INCOME;
				movement.referenceId = product.referenceId;
				movement.referenceType = product.referenceType;
				movement.inventoryStock = product.inventoryStockId;
				movement.createdAt = getCurrentDate();

				// Validar y sanitizar
				const errors = await validate(movement);
				if (errors.length > 0) {
					HttpResponseService.response(res, 400, errors, messages.general.error);
					return;
				}

				sanitize(movement);

				// Guardar el movimiento
				const saved = await inventoryMovementService.saveChanges(movement);
				savedMovements.push(saved);

				// Actualizar inventario
				currentInventoryStock.quantityProductStock += Number(movement.quantityProductMoved);
				await inventoryStockServices.saveChanges(currentInventoryStock);
			}

			HttpResponseService.response(res, 200, savedMovements, messages.inventoryStock.inventoryStockCreated);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}


	/**
	* Cargar detalle del stock de los productos 
	* @param req Solicitud
	* @param res Respuesta
	*/
	public async ctrlGetOneForDetail(req: Request, res: Response): Promise<void> {
		try {
			const inventoryMovementService = new InventoryMovementService();

			// Find  stock de los productos
			const inventoryMovement: InventoryMovement[] = await inventoryMovementService.getOneForDetail(parseInt(req.params.id));

			console.log('Movimientos del producto', inventoryMovement)

			// Valid the info
			if (inventoryMovement) {
				HttpResponseService.response(res, 200, inventoryMovement, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.inventoryStock.inventoryStockNotMovement);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Actualiza un stock de los productos 
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlUpdate(req: Request, res: Response): Promise<void> {
		try {
			const inventoryMovementService = new InventoryMovementService();

			// Search procedure
			const inventoryMovement: InventoryMovement = await inventoryMovementService.getOne(req.body.id);
			if (inventoryMovement) {
				//inventoryMovement.stock = req.body.stock;

				// Validate data stock products
				const inventoryStockErros = await validate(inventoryMovement);
				if (inventoryStockErros.length > 0) {
					HttpResponseService.response(res, 400, inventoryStockErros, messages.general.error);
				}

				// Sanitize data
				sanitize(inventoryMovement);

				// Save Changes
				//const result = await inventoryService.saveChanges(inventoryStock);
				//HttpResponseService.response(res, 200, result, messages.inventoryStock.inventoryStockUpdated);
			} else {
				HttpResponseService.response(res, 404, '', messages.inventoryStock.inventoryStockNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Elimina un stock de los productos 
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const inventoryMovementService = new InventoryMovementService();
			const notificationMiddleware = new NotificationMiddleware();
			const inventoryMovement: InventoryMovement = await inventoryMovementService.getOne(parseInt(req.params.id));

			if (inventoryMovement) {
				const data = await inventoryMovementService.remove(parseInt(req.params.id));
				if (data.affected > 0) {
					HttpResponseService.response(res, 200, null, messages.inventoryStock.inventoryStockDeleted);
				} else {
					HttpResponseService.response(res, 401, null, messages.general.error);
				}
			} else {
				HttpResponseService.response(res, 404, null, messages.inventoryStock.inventoryStockNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}
}
