import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { CompanyService } from '../../core/services/company.service';
import { Company } from '../../database/entities/company';
import { NotificationMiddleware } from './../../core/middlewares/notification.middleware';
import { HttpResponseService } from './../../core/services/http-response.service';
import { getCurrentDate } from '../../core/helpers/str-utils';
import { validate } from 'class-validator';

export class CompanyController {
	/**
	 * Mostrar todo la información en la base de datos
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const companyService = new CompanyService();
			const company: Company[] = await companyService.list();
			HttpResponseService.response(res, 200, company, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	* Cargar Company por Id
	* @param req Solicitud
	* @param res Respuesta
	*/
	public async ctrlGetOne(req: Request, res: Response): Promise<void> {
		try {
			// Find company
			const companyService = new CompanyService();

			// Find company
			const company: Company = await companyService.getOne(parseInt(req.params.id));

			// Valid the info
			if (company) {
				HttpResponseService.response(res, 200, company, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.company.companyNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
		 * Crea una nueva compañia
		 * @param req Solicitud
		 * @param res Respuesta
		 */
	public async ctrlCreate(req: Request, res: Response): Promise<void> {
		try {
			const companyService = new CompanyService();

			// Creating a instance of Company
			const company = new Company();
			company.businessName = req.body.businessName;
			company.documentNumber = req.body.documentNumber;
			company.address = req.body.address;

			// Validate data Bag Recipe
			const companyErros = await validate(company);
			if (companyErros.length > 0) {
				HttpResponseService.response(res, 400, companyErros, messages.general.error);
			}

			// Sanitize data
			sanitize(company);

			// Save Changes
			const result = await companyService.saveChanges(company);
			HttpResponseService.response(res, 200, result, messages.company.companyCreated);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Actualización de una compañia
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlUpdate(req: Request, res: Response): Promise<void> {
		try {
			const companyService = new CompanyService();

			// Find Company
			const company: Company = await companyService.getOne(req.body.id);

			// Return data
			if (company) {
				company.documentNumber = req.body.documentNumber;
				company.businessName = req.body.businessName;
				company.address = req.body.address;

				// Validate data Company
				const companyError = await validate(company);
				if (companyError.length > 0) {
					HttpResponseService.response(res, 400, companyError, messages.general.error);
				}

				// Sanitize data
				sanitize(company);

				// Save Changes
				const result = await companyService.saveChanges(company);
				HttpResponseService.response(res, 200, result, messages.company.companyUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.company.companyNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Eliminar compañia
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			// Search Company
			const companyService = new CompanyService();
			const company: Company = await companyService.getOne(parseInt(req.params.id));
			const notificationMiddleware = new NotificationMiddleware();

			// Return data
			if (company) {
				// Create a notification
				/* notificationMiddleware.createDelete({
					data: {
						company: `${company.businessName}`,
					},
				}); */

				// Result
				const data = await companyService.remove(company.id);
				HttpResponseService.response(res, 200, data, messages.company.companyDeleted);
			} else {
				HttpResponseService.response(res, 404, null, messages.company.companyNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

}
