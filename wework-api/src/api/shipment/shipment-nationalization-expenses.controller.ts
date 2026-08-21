import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { ShipmentNationalizationExpenseService } from '../../core/services/shipment-nationalization-expemse.service';
import { ShipmentService } from '../../core/services/shipment.service';
import { HttpResponseService } from '../../core/services/http-response.service';
import { Shipment } from '../../database/entities/shipment';
import { ShipmenNationalizationExpense } from '../../database/entities/shipment-nationalization-expense';
import { getCurrentDate } from '../../core/helpers/str-utils';

export class ShipmentNationalizationExpensesController {
	/**
	 * Carga todos las gatos de nacionalización para un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlListByShipmentId(req: Request, res: Response): Promise<void> {
		try {
			const shipmentNationalizationExpenseService = new ShipmentNationalizationExpenseService();
			const shipmenExpenseInformation: ShipmenNationalizationExpense[] = await shipmentNationalizationExpenseService.listByShipmenttId(parseInt(req.params.id));
			HttpResponseService.response(res, 200, shipmenExpenseInformation, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crear o actualizar los gastos de nacionalización para un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreateOrUpdate(req: Request, res: Response): Promise<void> {
		try {
			const shipmentService = new ShipmentService();
			const shipmentNationalizationExpenseService = new ShipmentNationalizationExpenseService();
			const expenses: ShipmenNationalizationExpense[] = req.body.expenses;
			const newExpenses: ShipmenNationalizationExpense[] = [];

			// Find shipment
			const shipment: Shipment = await shipmentService.getOneOnlyObject(req.body.id);

			if (shipment) {
				// Delete all expenses
				await shipmentNationalizationExpenseService.remove(shipment.id);
				console.log('Aqui los datos a guardar de llos gastos de nacionalizacion', expenses)

				// Working to add expense
				if (expenses.length > 0) {
					expenses.forEach(async (element: any) => {
						const nExpense = new ShipmenNationalizationExpense();
						nExpense.typeExpense = element.typeExpense;
						nExpense.paymentConcept = element.paymentConcept;
						nExpense.paymentDate = element.paymentDate;
						nExpense.paymentReference = element.paymentReference;
						nExpense.amountDollars = (/,/.test(element.amountDollars)) ? element.amountDollars.replace(/,/g, '') : element.amountDollars;
						nExpense.feeAmount = (/,/.test(element.feeAmount)) ? element.feeAmount.replace(/,/g, '') : element.feeAmount; 
						nExpense.amountBolivars = (/,/.test(element.amountBolivars)) ? element.amountBolivars.replace(/,/g, '') : element.amountBolivars;
						nExpense.createdAt = getCurrentDate();
						nExpense.shipment = shipment;

						// Sanitize data
						sanitize(nExpense);

						// Save on array
						newExpenses.push(nExpense);
					});

					// Save Changes
					await shipmentNationalizationExpenseService.saveChanges(newExpenses);
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
	 * Remueve los gastos de nacionalización para un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const shipmentService = new ShipmentService();
			const shipmentNationalizationExpenseService = new ShipmentNationalizationExpenseService();

			// Find shipment
			const shipment: Shipment = await shipmentService.getOneOnlyObject(req.body.id);

			if (shipment) {
				// Delete all Observations
				await shipmentNationalizationExpenseService.remove(shipment.id);

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
