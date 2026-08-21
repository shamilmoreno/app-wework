import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import { HttpResponseService } from '../../core/services/http-response.service';
import messages from '../../core/helpers/messages';
import { BagRecipeService } from '../../core/services/bag-recipe.service';
import { BagRecipe } from '../../database/entities/bag-recipe';
import { BagRecipePaymentService } from '../../core/services/bag-recipe-payment.service';
import { BagRecipePayment } from '../../database/entities/bag-recipe-payment';

export class BagRecipePaymentController {
	/**
 * Carga todos los pagos de una receta
 * @param req Solicitud
 * @param res Respuesta
 */
	public async ctrlListByBagRecipetId(req: Request, res: Response): Promise<void> {
		try {
			const BbgRecipePaymentService = new BagRecipePaymentService();
			const bagRecipePayment: BagRecipePayment[] = await BbgRecipePaymentService.listByBagRecipeId(parseInt(req.params.id));
			HttpResponseService.response(res, 200, bagRecipePayment, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crear o actualiza los payments de una receta
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreateOrUpdate(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeService = new BagRecipeService();
			const bagRecipePaymentService = new BagRecipePaymentService();
			const payments: BagRecipePayment[] = req.body.payments;
			const newPayments: BagRecipePayment[] = [];

			// Find Bag Recipe
			const bagRecipe: BagRecipe = await bagRecipeService.getOneOnlyObject(req.body.id);

			if (bagRecipe) {
				// Delete all payments
				await bagRecipePaymentService.remove(bagRecipe.id);

				// Working to add payments
				if (payments.length > 0) {
					payments.forEach(async (i: any) => {
						const nPayment = new BagRecipePayment();
						nPayment.bagRecipe = req.body.id;
						nPayment.name = i.name;
						nPayment.paymentDate = i.paymentDate;
						nPayment.amount = (/,/.test(i.amount)) ? i.amount.replace(/,/g, '') : i.amount;
						nPayment.description = i.description;
						nPayment.paymentMethod = i.paymentMethod;
						nPayment.referenceNumber = i.referenceNumber;
						sanitize(nPayment);

						// Save on array
						newPayments.push(nPayment);
					});

					// Save Changes
					await bagRecipePaymentService.saveChanges(newPayments);
				}

				await bagRecipeService.saveChanges(bagRecipe);

				// Response
				HttpResponseService.response(res, 200, null, messages.bagRecipe.bagRecipeDetailUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Remueve los Pagos de una receta
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeService = new BagRecipeService();
			const bagRecipePaymentService = new BagRecipePaymentService();
			let bagRecipeId = Number(req.params.id);

			// Find recipe
			const bagRecipe: BagRecipe = await bagRecipeService.getOneOnlyObject(bagRecipeId);

			if (bagRecipe) {
				// Delete all Payments
				await bagRecipePaymentService.remove(bagRecipe.id);

				// Response
				HttpResponseService.response(res, 200, null, messages.bagRecipe.bagRecipeDetailUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}
}
