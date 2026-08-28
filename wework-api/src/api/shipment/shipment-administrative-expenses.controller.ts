import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { ShipmentAdministrativeExpenseService } from '../../core/services/shipment-administrative-expemse.service ';
import { ShipmentService } from '../../core/services/shipment.service';
import { HttpResponseService } from '../../core/services/http-response.service';
import { Shipment } from '../../database/entities/shipment';
import { ShipmenAdministrativeExpense } from '../../database/entities/shipment-administrative-expense';
import { getCurrentDate } from '../../core/helpers/str-utils';

export class ShipmentAdministrativeExpensesController {
	/**
	 * Carga todos las gatos administrativos de un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlListByShipmentId(req: Request, res: Response): Promise<void> {
		try {
			const shipmentAdministrativeExpenseService = new ShipmentAdministrativeExpenseService();
			const shipmenExpenseInformation: ShipmenAdministrativeExpense[] = await shipmentAdministrativeExpenseService.listByShipmenttId(parseInt(req.params.id));
			HttpResponseService.response(res, 200, shipmenExpenseInformation, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crear o actualizar los gastos administrativos de un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreateOrUpdate(req: Request, res: Response): Promise<void> {
		try {
			const shipmentService = new ShipmentService();
			const shipmentAdministrativeExpenseService = new ShipmentAdministrativeExpenseService();
			const expenses: ShipmenAdministrativeExpense[] = req.body.expenses;
			const newExpenses: ShipmenAdministrativeExpense[] = [];

			// Find shipment
			const shipment: Shipment = await shipmentService.getOneOnlyObject(req.body.id);

			if (shipment) {
				// Delete all expenses
				await shipmentAdministrativeExpenseService.remove(shipment.id);
				console.log('Aqui los datos a guardar de los gastos Administrativos', expenses)

				// Working to add expense
				if (expenses.length > 0) {
					expenses.forEach(async (element: any) => {
						const nExpense = new ShipmenAdministrativeExpense();
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
					await shipmentAdministrativeExpenseService.saveChanges(newExpenses);
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
	 * Remueve los gastos administrativos de un embarque
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const shipmentService = new ShipmentService();
			const shipmentAdministrativeExpenseService = new ShipmentAdministrativeExpenseService();

			// Find shipment
			const shipment: Shipment = await shipmentService.getOneOnlyObject(req.body.id);

			if (shipment) {
				// Delete all Observations
				await shipmentAdministrativeExpenseService.remove(shipment.id);

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
