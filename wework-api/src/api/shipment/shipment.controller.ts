import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { ShipmentService } from '../../core/services/shipment.service';
import { CategoryService } from '../../core/services/category.service';
import { Shipment } from '../../database/entities/shipment';
import { NotificationMiddleware } from '../../core/middlewares/notification.middleware';
import { HttpResponseService } from '../../core/services/http-response.service';
import { validate } from 'class-validator';
import { getCurrentDate } from '../../core/helpers/str-utils';
import moment from 'moment';

export class ShipmentController {
	/**
 	* Carga todos los embarques de la base de datos
 	* @param req Solicitud
 	* @param res Respuesta
 	*/
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const shipmentService = new ShipmentService();
			const shipments: Shipment[] = await shipmentService.list();
			HttpResponseService.response(res, 200, shipments, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	* Carga todos los embarques pendientes de la base de datos
	* @param req Solicitud
	* @param res Respuesta
	*/
	public async ctrlListPendingShipments(req: Request, res: Response): Promise<void> {
		try {
			const shipmentService = new ShipmentService();
			const categoryService = new CategoryService();
			const statesToFilter: any = [];
			const state = await categoryService.getOneByNemWithSubcategories('ede');
			state.subcategories.forEach(s => {
				switch (s.name) {
					case 'En Transito':
						statesToFilter.push(s.id)
						break;

					case 'Llego':
						statesToFilter.push(s.id)
						break;
					default:
						break;
				}

			});
			const shipments: Shipment[] = await shipmentService.listPendingShipments(statesToFilter);
			HttpResponseService.response(res, 200, shipments, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar embarque por Id
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOne(req: Request, res: Response): Promise<void> {
		try {
			const shipmentController = new ShipmentController()
			const shipmentService = new ShipmentService();

			// Find shipment
			const shipment: Shipment = await shipmentService.getOne(parseInt(req.params.id));
			const shipmentsNew = await shipmentController.getStructureLegalRegime(shipment);

			// Valid the info
			if (shipment) {
				HttpResponseService.response(res, 200, shipmentsNew, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.shipment.shipmentNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	* Cargar detalle del embarque
	* @param req Solicitud
	* @param res Respuesta
	*/
	public async ctrlGetOneForDetail(req: Request, res: Response): Promise<void> {
		try {
			const shipmentService = new ShipmentService();

			// Find Shipment
			const shipment: Shipment = await shipmentService.getOneForDetail(parseInt(req.params.id));

			// Valid the info
			if (shipment) {
				HttpResponseService.response(res, 200, shipment, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.shipment.shipmentNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Control de la respuesta
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlFilterDataControl(req: Request, res: Response) {
		try {
			const shipmentService = new ShipmentService();

			let pruebas = String(req.query.startDate)
			let pruebas2 = String(req.query.endDate)

			// Logic
			const init = moment(pruebas).format('YYYY-MM-DD');
			const end = moment(pruebas2).format('YYYY-MM-DD');
			console.log('Aca las fechas de busqueda', init, end);

			
			const Shipemnts: Shipment[] = await shipmentService.getByDateFilter(init, end);
			HttpResponseService.response(res, 200, Shipemnts, '')

		
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crea un nuevo embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreate(req: Request, res: Response): Promise<void> {
		try {
			moment.locale('es');
			const todayDate = moment();
			const shipmentService = new ShipmentService();

			// Creating a instance of Shipment
			const shipment = new Shipment();
			shipment.bl = req.body.bl.toUpperCase();
			shipment.license = req.body.license.toUpperCase();
			shipment.provider = req.body.provider;
			shipment.brand = req.body.brand;
			shipment.description = req.body.description;
			shipment.entryPort = req.body.entryPort;
			shipment.origin = req.body.origin;
			shipment.state = req.body.state;
			shipment.unitPrice = (/,/.test(req.body.unitPrice)) ? req.body.unitPrice.replace(/,/g, '') : req.body.unitPrice;
			shipment.containerCapacity = req.body.containerCapacity;
			shipment.containerQuantity = req.body.containerQuantity;
			shipment.quantityMetricTons = req.body.quantityMetricTons;
			shipment.kilograms = (/,/.test(req.body.kilograms)) ? req.body.kilograms.replace(/,/g, '') : req.body.kilograms;
			shipment.arrivalDate = req.body.arrivalDate;
			shipment.freeDays = req.body.freeDays;
			shipment.amountToPayDay = req.body.amountToPayDay;
			shipment.startDateDelay = req.body.startDateDelay;
			if (todayDate.isAfter(moment(req.body.startDateDelay))) {
				shipment.daysLate = (todayDate.diff(moment(req.body.startDateDelay), 'days'));
				shipment.amountPayDelay = shipment.daysLate * req.body.amountToPayDay;
				shipment.isDelayedShipment = true
			} else {
				shipment.daysLate = 0;
				shipment.amountPayDelay = 0.00;
				shipment.isDelayedShipment = false
			};
			shipment.createdAt = getCurrentDate();

			// Validate data Shipment
			const shipmentErrors = await validate(shipment);
			if (shipmentErrors.length > 0) {
				HttpResponseService.response(res, 400, shipmentErrors, messages.general.error);
			}

			// Sanitize data
			sanitize(shipment);

			// Save Changes
			const result = await shipmentService.saveChanges(shipment);
			HttpResponseService.response(res, 200, result, messages.shipment.shipmentCreated);
		} catch (error) {
			if (error.detail.search('bl') !== -1) {
				HttpResponseService.response(res, 409, error, messages.shipment.shipmentBltNumberExists);
			} else {
				HttpResponseService.response(res, 500, error, messages.general.error);
			}
		}
	}

	/**
	 * Actualiza un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlUpdate(req: Request, res: Response): Promise<void> {
		try {
			moment.locale('es');
			const todayDate = moment();
			const shipmentService = new ShipmentService();

			// Search procedure
			const shipment: Shipment = await shipmentService.getOne(req.body.id);

			if (shipment) {
				shipment.bl = req.body.bl.toUpperCase();
				shipment.license = req.body.license.toUpperCase();
				shipment.provider = req.body.provider;
				shipment.brand = req.body.brand;
				shipment.description = req.body.description;
				shipment.entryPort = req.body.entryPort;
				shipment.origin = req.body.origin;
				shipment.state = req.body.state;
				shipment.unitPrice = (/,/.test(req.body.unitPrice)) ? req.body.unitPrice.replace(/,/g, '') : req.body.unitPrice;
				shipment.containerCapacity = req.body.containerCapacity;
				shipment.containerQuantity = req.body.containerQuantity;
				shipment.quantityMetricTons = req.body.quantityMetricTons;
				shipment.kilograms = (/,/.test(req.body.kilograms)) ? req.body.kilograms.replace(/,/g, '') : req.body.kilograms;
				shipment.arrivalDate = req.body.arrivalDate;
				shipment.freeDays = req.body.freeDays;
				shipment.amountToPayDay = req.body.amountToPayDay;
				shipment.startDateDelay = req.body.startDateDelay;
				if (todayDate.isAfter(moment(req.body.startDateDelay))) {
					shipment.daysLate = todayDate.diff(moment(req.body.startDateDelay), 'days');
					shipment.amountPayDelay = shipment.daysLate * req.body.amountToPayDay;
					shipment.isDelayedShipment = true
				} else {
					shipment.daysLate = 0;
					shipment.amountPayDelay = 0.00;
					shipment.isDelayedShipment = false
				};

				// Validate data Shipemnt
				const shipmentErros = await validate(shipment);

				if (shipmentErros.length > 0) {
					HttpResponseService.response(res, 400, shipmentErros, messages.general.error);
				}

				// Sanitize data
				sanitize(shipment);

				// Save Changes
				const result = await shipmentService.saveChanges(shipment);
				HttpResponseService.response(res, 200, result, messages.shipment.shipmentUpdated);
			} else {
				HttpResponseService.response(res, 404, '', messages.shipment.shipmentNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Elimina un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const shipmentService = new ShipmentService();
			const notificationMiddleware = new NotificationMiddleware();
			const shipment: Shipment = await shipmentService.getOne(parseInt(req.params.id));

			if (shipment) {
				const data = await shipmentService.remove(parseInt(req.params.id));
				if (data.affected > 0) {
					HttpResponseService.response(res, 200, null, messages.shipment.shipmentDeleted);
				} else {
					HttpResponseService.response(res, 401, null, messages.general.error);
				}
			} else {
				HttpResponseService.response(res, 404, null, messages.shipment.shipmentNotFound);
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
	public async getStructureLegalRegime(shipment: any) {
		try {
			let legalRModificateany: any[] = []
			shipment.legalRegimes.forEach((r: any) => {
				legalRModificateany.push(r.legalRegimes.id);
			});
			shipment.legalRegimes = legalRModificateany;
			return shipment;
		} catch (error) {
			console.log(error);
		}
	}
}
