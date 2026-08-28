import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { ExchangeRateService } from '../../core/services/exchange-rate.service ';
import { ExchangeRate } from '../../database/entities/exchange-rate ';
import { NotificationMiddleware } from './../../core/middlewares/notification.middleware';
import { HttpResponseService } from './../../core/services/http-response.service';
import { getCurrentDate } from '../../core/helpers/str-utils';
import { validate } from 'class-validator';

export class ExchangeRateController {
	/**
	 * Mostrar todo la información en la base de datos
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const exchangeRateService = new ExchangeRateService();
			const exchangeRate: ExchangeRate[] = await exchangeRateService.list();
			HttpResponseService.response(res, 200, exchangeRate, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	* Cargar Tasa por Id
	* @param req Solicitud
	* @param res Respuesta
	*/
	public async ctrlGetOne(req: Request, res: Response): Promise<void> {
		try {
			// Find rate
			const exchangeRateService = new ExchangeRateService();

			// Find rate
			const exchangeRate: ExchangeRate = await exchangeRateService.getOne(parseInt(req.params.id));

			// Valid the info
			if (exchangeRate) {
				HttpResponseService.response(res, 200, exchangeRate, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.exchangeRate.exchangeRateNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
		 * Crea una nueva tasa
		 * @param req Solicitud
		 * @param res Respuesta
		 */
	public async ctrlCreate(req: Request, res: Response): Promise<void> {
		try {
			const exchangeRateService = new ExchangeRateService();

			// Creating a instance of Rate
			const exchangeRate = new ExchangeRate();
			exchangeRate.date = req.body.date;
			exchangeRate.source = req.body.source;
			exchangeRate.usd_rate = req.body.sd_rate;

			// Validate data Rate
			const exchangeRateError = await validate(exchangeRate);
			if (exchangeRateError.length > 0) {
				HttpResponseService.response(res, 400, exchangeRateError, messages.general.error);
			}

			// Sanitize data
			sanitize(exchangeRate);

			// Save Changes
			const result = await exchangeRateService.saveChanges(exchangeRate);
			HttpResponseService.response(res, 200, result, messages.exchangeRate.exchangeRateCreated);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Actualización de una tasa
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlUpdate(req: Request, res: Response): Promise<void> {
		try {
			const exchangeRateService = new ExchangeRateService();

			// Find rate
			const exchangeRate: ExchangeRate = await exchangeRateService.getOne(req.body.id);

			// Return data
			if (exchangeRate) {
				exchangeRate.date = req.body.date;
				exchangeRate.source = req.body.source;
				exchangeRate.usd_rate = req.body.sd_rate;

				// Validate data Rate
				const companyError = await validate(exchangeRate);
				if (companyError.length > 0) {
					HttpResponseService.response(res, 400, companyError, messages.general.error);
				}

				// Sanitize data
				sanitize(exchangeRate);

				// Save Changes
				const result = await exchangeRateService.saveChanges(exchangeRate);
				HttpResponseService.response(res, 200, result, messages.exchangeRate.exchangeRateUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.exchangeRate.exchangeRateNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Eliminar tasa
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			// Search Rate
			const exchangeRateService = new ExchangeRateService();
			const exchangeRate: ExchangeRate = await exchangeRateService.getOne(parseInt(req.params.id));
			const notificationMiddleware = new NotificationMiddleware();

			// Return data
			if (exchangeRate) {
				// Create a notification
				/* notificationMiddleware.createDelete({
					data: {
						exchangeRate: `${company.businessName}`,
					},
				}); */

				// Result
				//const data = await exchangeRate.remove(exchangeRate.id);
				//HttpResponseService.response(res, 200, data, messages.exchangeRate.exchangeRateDeleted);
			} else {
				HttpResponseService.response(res, 404, null, messages.exchangeRate.exchangeRateNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

}
