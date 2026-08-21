import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import { HttpResponseService } from '../../core/services/http-response.service';
import messages from '../../core/helpers/messages';
import { BagRecipeService } from '../../core/services/bag-recipe.service';
import { BagRecipe } from '../../database/entities/bag-recipe';
import { BagRecipeMaquiladorService } from '../../core/services/bag-recipe-maquilador.service';
import { BagRecipeMaquilador } from '../../database/entities/bag-recipe-maquilador';

export class BagRecipeMaquiladorController {
	/**
 * Carga todos los maquiladores de una receta
 * @param req Solicitud
 * @param res Respuesta
 */
	public async ctrlListByBagRecipetId(req: Request, res: Response): Promise<void> {
		try {
			const BbgRecipeMaquiladorService = new BagRecipeMaquiladorService();
			const bagRecipeMaquilador: BagRecipeMaquilador[] = await BbgRecipeMaquiladorService.listByBagRecipeId(parseInt(req.params.id));
			HttpResponseService.response(res, 200, bagRecipeMaquilador, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crear o actualiza los maquiladores de una receta
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreateOrUpdate(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeService = new BagRecipeService();
			const bagRecipeMaquiladorService = new BagRecipeMaquiladorService();
			const maquiladors: BagRecipeMaquilador[] = req.body.maquiladors;
			const newMaquiladors: BagRecipeMaquilador[] = [];

			// Find Bag Recipe
			const bagRecipe: BagRecipe = await bagRecipeService.getOneOnlyObject(req.body.id);

			if (bagRecipe) {
				// Delete all payments
				await bagRecipeMaquiladorService.remove(bagRecipe.id);

				// Working to add payments
				if (maquiladors.length > 0) {
					maquiladors.forEach(async (i: any) => {
						const nMaquilador = new BagRecipeMaquilador();
						nMaquilador.amount = Number((/,/.test(i.amount)) ? i.amount.replace(/,/g, '') : i.amount);
						nMaquilador.maquiladorMajor = i.maquiladorMajor;
						nMaquilador.bagRecipe = req.body.id;
						nMaquilador.company = i.company;
						sanitize(nMaquilador);

						// Save on array
						newMaquiladors.push(nMaquilador);
					});

					// Save Changes
					await bagRecipeMaquiladorService.saveChanges(newMaquiladors);
				}

				await bagRecipeService.saveChanges(bagRecipe);

				// Response
				HttpResponseService.response(res, 200, null, messages.maquilador.maquiladorDetailUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.maquilador.maquiladorNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Remueve los Maquiladores de una receta
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const bagRecipeService = new BagRecipeService();
			const bagRecipeMaquiladorService = new BagRecipeMaquiladorService();
			let bagRecipeId = Number (req.params.id);

			// Find recipe
			const bagRecipe: BagRecipe = await bagRecipeService.getOneOnlyObject(bagRecipeId);

			if (bagRecipe) {
				// Delete all Maquiladores
				await bagRecipeMaquiladorService.remove(bagRecipe.id);

				// Response
				HttpResponseService.response(res, 200, null, messages.maquilador.maquiladorDetailUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.maquilador.maquiladorNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}
}
