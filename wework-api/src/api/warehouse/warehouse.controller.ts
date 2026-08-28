import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { WareHouseService } from '../../core/services/warehouse.service ';
import { WareHouse } from '../../database/entities/warehouse ';
import { NotificationMiddleware } from '../../core/middlewares/notification.middleware';
import { HttpResponseService } from '../../core/services/http-response.service';
import { validate } from 'class-validator';

export class WareHouseController {
	/**
	 * Mostrar todo la información en la base de datos
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const wareHouseService = new WareHouseService();
			const wareHouse: WareHouse[] = await wareHouseService.list();
			HttpResponseService.response(res, 200, wareHouse, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	* Cargar Almacenes por Id
	* @param req Solicitud
	* @param res Respuesta
	*/
	public async ctrlGetOne(req: Request, res: Response): Promise<void> {
		try {
			// Find wareHouse
			const wareHouseService = new WareHouseService();

			// Find wareHouse
			const wareHouse: WareHouse = await wareHouseService.getOne(parseInt(req.params.id));

			// Valid the info
			if (wareHouse) {
				HttpResponseService.response(res, 200, wareHouse, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.wareHouse.wareHouseNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
		 * Crea un nuevo almacén
		 * @param req Solicitud
		 * @param res Respuesta
		 */
	public async ctrlCreate(req: Request, res: Response): Promise<void> {
		try {
			const wareHouseService = new WareHouseService();

			// Creating a instance of Warehouse
			const wareHouse = new WareHouse();
			wareHouse.name = req.body.name;
			wareHouse.address = req.body.address;

			// Validate data WareHouse
			const wareHouseErros = await validate(wareHouse);
			if (wareHouseErros.length > 0) {
				HttpResponseService.response(res, 400, wareHouseErros, messages.general.error);
			}

			// Sanitize data
			sanitize(wareHouse);

			// Save Changes
			const result = await wareHouseService.saveChanges(wareHouse);
			HttpResponseService.response(res, 200, result, messages.wareHouse.wareHouseCreated);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Actualización de una almacén
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlUpdate(req: Request, res: Response): Promise<void> {
		try {
			const wareHouseService = new WareHouseService();

			// Find wareHouse
			const wareHouse: WareHouse = await wareHouseService.getOne(req.body.id);

			// Return data
			if (wareHouse) {
				wareHouse.name = req.body.name;
				wareHouse.address = req.body.address;

				// Validate data wareHouse
				const wareHouseError = await validate(wareHouse);
				if (wareHouseError.length > 0) {
					HttpResponseService.response(res, 400, wareHouseError, messages.general.error);
				}

				// Sanitize data
				sanitize(wareHouse);

				// Save Changes
				const result = await wareHouseService.saveChanges(wareHouse);
				HttpResponseService.response(res, 200, result, messages.wareHouse.wareHouseUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.wareHouse.wareHouseNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Eliminar almacén
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			// Search WareHouse
			const wareHouseService = new WareHouseService();
			const wareHouse: WareHouse = await wareHouseService.getOne(parseInt(req.params.id));
			const notificationMiddleware = new NotificationMiddleware();

			// Return data
			if (wareHouse) {
				// Create a notification
				/* notificationMiddleware.createDelete({
					data: {
						wareHouse: `${wareHouse.businessName}`,
					},
				}); */

				// Result
				const data = await wareHouseService.remove(wareHouse.id);
				HttpResponseService.response(res, 200, data, messages.wareHouse.wareHouseDeleted);
			} else {
				HttpResponseService.response(res, 404, null, messages.wareHouse.wareHouseNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

}
