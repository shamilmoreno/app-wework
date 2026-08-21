import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { ShipmentService } from '../../core/services/shipment.service';
import { ShipmentRegimeService } from '../../core/services/shipment-regimen.service';
import { HttpResponseService } from '../../core/services/http-response.service';
import { Shipment } from '../../database/entities/shipment';
import { ShipmentRegime } from '../../database/entities/shipment-regime';

export class ShipmentRegimeController {
	/**
	 * Carga todos los Regimenes Legales de un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlListByShipmentId(req: Request, res: Response): Promise<void> {
		try {
			const shipmentRegimeService = new ShipmentRegimeService();
			const shipmentRegimes: ShipmentRegime[] = await shipmentRegimeService.listByShipmenttId(parseInt(req.params.id));
			HttpResponseService.response(res, 200, shipmentRegimes, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crear o actualizar los Regimenes Legales de un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreateOrUpdate(req: Request, res: Response): Promise<void> {
		try {
			const shipmentService = new ShipmentService();
			const shipmentRegimeService = new ShipmentRegimeService();
			const regimes: ShipmentRegime[] = req.body.legalRegimes;
			const newRegimes: ShipmentRegime[] = [];

			// Find shipment
			const shipment: Shipment = await shipmentService.getOneOnlyObject(req.body.id);

			if (shipment) {
				// Delete all Legal Regimes
				await shipmentRegimeService.remove(shipment.id);

				// Working to add regime
				if (regimes.length > 0) {
					regimes.forEach(async (element: any) => {
						const nRegime = new ShipmentRegime();
						nRegime.legalRegimes = element;
						nRegime.shipment = shipment;

						// Sanitize data
						sanitize(nRegime);

						// Save on array
						newRegimes.push(nRegime);
					});

					// Save Changes
					await shipmentRegimeService.saveChanges(newRegimes);
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
	 * Remueve los Regimenes Legales de un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const shipmentService = new ShipmentService();
			const shipmentRegimeService = new ShipmentRegimeService();

			// Find shipment
			const shipment: Shipment = await shipmentService.getOneOnlyObject(req.body.id);

			if (shipment) {
				// Delete all Legal Regimes
				await shipmentRegimeService.remove(shipment.id);

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
