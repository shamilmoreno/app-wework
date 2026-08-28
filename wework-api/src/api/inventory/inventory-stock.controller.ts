import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { InventoryStock } from '../../database/entities/inventory-stock ';
import { NotificationMiddleware } from '../../core/middlewares/notification.middleware';
import { HttpResponseService } from '../../core/services/http-response.service';
import { InventoryStockService } from '../../core/services/inventory-stock.service';
import { validate } from 'class-validator';

export class InventoryStockController {
	/**
	* Carga todos las stock de los productos en inventario de la base de datos
	* @param req Solicitud
	* @param res Respuesta
	*/
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const inventoryStockService = new InventoryStockService();

			const inventoryStock: InventoryStock[] = await inventoryStockService.list();
			HttpResponseService.response(res, 200, inventoryStock, '');
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
			const inventaryStockService = new InventoryStockService();

			// Find stock products
			const inventoryStock: InventoryStock = await inventaryStockService.getOne(parseInt(req.params.id));

			// Valid the info
			if (inventoryStock) {
				HttpResponseService.response(res, 200, inventoryStock, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
			}
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
			const inventoryStockService = new InventoryStockService();

			// Find  stock de los productos
			const inventoryStock: InventoryStock = await inventoryStockService.getOneForDetail(parseInt(req.params.id));

			// Valid the info
			if (inventoryStock) {
				HttpResponseService.response(res, 200, inventoryStock, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
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
			const inventoryStockService = new InventoryStockService();

			// Search procedure
			const inventoryStock: InventoryStock = await inventoryStockService.getOne(req.body.id);
			if (inventoryStock) {
				inventoryStock.quantity = req.body.monthRecipeBag;

				// Validate data stock products
				const inventoryStockErros = await validate(inventoryStock);
				if (inventoryStockErros.length > 0) {
					HttpResponseService.response(res, 400, inventoryStockErros, messages.general.error);
				}

				// Sanitize data
				sanitize(inventoryStock);

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
			const inventoryStockService = new InventoryStockService();
			const notificationMiddleware = new NotificationMiddleware();
			const inventoryStock: InventoryStock = await inventoryStockService.getOne(parseInt(req.params.id));

			if (inventoryStock) {
				const data = await inventoryStockService.remove(parseInt(req.params.id));
				if ((data?.affected ?? 0) > 0) {
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
