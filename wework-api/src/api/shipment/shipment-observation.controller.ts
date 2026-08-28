import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { ShipmentObservationService } from '../../core/services/shipment-observation.service';
import { ShipmentService } from '../../core/services/shipment.service';
import { HttpResponseService } from '../../core/services/http-response.service';
import { Shipment } from '../../database/entities/shipment';
import { ShipmentObservation } from '../../database/entities/shipment-observation';
import { getCurrentDate } from '../../core/helpers/str-utils';

export class ShipmentObservationController {
	/**
	 * Carga todos las observaciones de un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlListByShipmentId(req: Request, res: Response): Promise<void> {
		try {
			const shipmentObservationService = new ShipmentObservationService();
			const shipmentObservations: ShipmentObservation[] = await shipmentObservationService.listByShipmenttId(parseInt(req.params.id));
			HttpResponseService.response(res, 200, shipmentObservations, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crear o actualizar las observaciones de un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreateOrUpdate(req: Request, res: Response): Promise<void> {
		try {
			const shipmentService = new ShipmentService();
			const shipmentObservationService = new ShipmentObservationService();
			const observations: ShipmentObservation[] = req.body.observations;
			const newObservations: ShipmentObservation[] = [];

			// Find shipment
			const shipment: Shipment = await shipmentService.getOneOnlyObject(req.body.id);

			if (shipment) {
				// Delete all observations
				await shipmentObservationService.remove(shipment.id);
				console.log('Observaciones a guardar', observations);

				// Working to add observation
				if (observations.length > 0) {
					observations.forEach(async (element: any) => {
						const nObservation = new ShipmentObservation();
						nObservation.title = element.title;
						nObservation.description = element.description;
						nObservation.createdAt = getCurrentDate();
						nObservation.shipment = shipment;

						// Sanitize data
						sanitize(nObservation);

						// Save on array
						newObservations.push(nObservation);
					});

					// Save Changes
					await shipmentObservationService.saveChanges(newObservations);
				}

				await shipmentService.saveChanges(shipment);

				// Response
				HttpResponseService.response(res, 200, null, messages.shipment.shipmentDetailUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.shipment.shipmentNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Remueve las observaciones Legales de un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const shipmentService = new ShipmentService();
			const shipmentObservationService = new ShipmentObservationService();

			// Find shipment
			const shipment: Shipment = await shipmentService.getOneOnlyObject(req.body.id);

			if (shipment) {
				// Delete all Observations
				await shipmentObservationService.remove(shipment.id);

				// Response
				HttpResponseService.response(res, 200, null, messages.shipment.shipmentDetailUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.shipment.shipmentNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}
}
