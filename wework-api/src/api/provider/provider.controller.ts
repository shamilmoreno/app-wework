import { sanitize } from 'class-sanitizer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { getCurrentDate } from '../../core/helpers/str-utils';
import { NotificationMiddleware } from '../../core/middlewares/notification.middleware';
import { HttpResponseService } from '../../core/services/http-response.service';
import { ProviderService } from '../../core/services/provider.service';
import { UploadService } from '../../core/services/upload.service';
import { Provider } from '../../database/entities/provider';


// MODELS
import { ProviderModel } from '../../core/models/provider.model ';

export class ProviderController {
	/**
	 * Cargar todos los Proceedor de la base de datos
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const providerService = new ProviderService();
			const provider: Provider[] = await providerService.list();
			HttpResponseService.response(res, 200, provider, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar Proceedor por Id
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOne(req: Request, res: Response): Promise<void> {
		try {
			// Find provider
			const providerService = new ProviderService();

			// Find provider
			const provider: Provider = await providerService.getOne(parseInt(req.params.id));

			// Valid the info
			if (provider) {
				HttpResponseService.response(res, 200, provider, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.provider.providerNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	* Crear a un nuevo proveedor
	* @param req Solicitud
	* @param res Respuesta
	*/
	public async ctrlCreate(req: Request, res: Response): Promise<void> {
		try {
			const providerService = new ProviderService();

			// Creating a instance of proveedor
			const provider = new Provider();
			provider.businessName = req.body.businessName;
			provider.identificationNumber = req.body.identificationNumber;
			provider.email = req.body.email;
			provider.address = req.body.address;
			provider.createdAt = getCurrentDate();

			// Validate data proveedor
			const providerError = await validate(provider);

			if (providerError.length > 0) {
				HttpResponseService.response(res, 400, providerError, messages.general.error);
			}

			// Sanitize data
			sanitize(provider);

			// Save Changes
			const result = await providerService.saveChanges(provider);
			HttpResponseService.response(res, 200, result, messages.provider.providerCreated);
		} catch (error) {
			if (error.detail.search('identificationNumber') !== -1) {
				HttpResponseService.response(res, 500, error, messages.provider.providerNumberExists);
			} else {
				HttpResponseService.response(res, 500, error, messages.general.error);
			}
		}
	}

	/**
	 * Actualización de un proveedor
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlUpdate(req: Request, res: Response): Promise<void> {
		try {
			const providerService = new ProviderService();

			// Find Provider
			const provider: Provider = await providerService.getOne(req.body.id);

			// Return data
			if (provider) {
				provider.businessName = req.body.businessName;
				provider.identificationNumber = req.body.identificationNumber;
				provider.email = req.body.email;
				provider.address = req.body.address;

				// Validate data Provider
				const providerError = await validate(provider);
				if (providerError.length > 0) {
					HttpResponseService.response(res, 400, providerError, messages.general.error);
				}

				// Sanitize data
				sanitize(provider);

				// Save Changes
				const result = await providerService.saveChanges(provider);
				HttpResponseService.response(res, 200, result, messages.provider.providerUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.provider.providerNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar proveedor para validar la información
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	/* public async ctrlGetOneForDataValidation(req: Request, res: Response): Promise<void> {
		try {
			// Find Proveedor
			const providerService = new ProviderService();

			// Creating a instance of Provider
			const dt = req.body.documentType;
			const dn = req.body.documentNumber;

			// Find Provider
			const provider: Provider = await providerService.getOneForDataValidation(dt, dn);


			// Valid the info
			if (provider) {
				HttpResponseService.response(res, 200, provider, messages.provider.providerDataValidationSuccess);
			} else {
				HttpResponseService.response(res, 404, null, messages.provider.providerNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	} */

	/**
	 * Cargar detalle del proveedor
	 * @param res Respuesta
	 */
	public async ctrlGetOneForDetail(req: Request, res: Response): Promise<void> {
		try {
			const providerController = new ProviderController();
			const providerService = new ProviderService();

			// Find Provider
			const provider: Provider = await providerService.getOneForDetail(parseInt(req.params.id));

			// Build the info
			//const data = await providerController.getStructureData(provider);

			// Valid the info
			if (provider) {
				HttpResponseService.response(res, 200, provider, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.provider.providerNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Eliminar proveedor
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			// Search Provider
			const providerService = new ProviderService();
			const provider: Provider = await providerService.getOne(parseInt(req.params.id));
			const notificationMiddleware = new NotificationMiddleware();

			// Return data
			if (provider) {
				// Create a notification
				/* notificationMiddleware.createDelete({
					data: {
						provider: `${provider.businessName}`,
					},
				}); */

				// Result
				const data = await providerService.remove(provider.id);
				HttpResponseService.response(res, 200, data, messages.provider.providerDeleted);
			} else {
				HttpResponseService.response(res, 404, null, messages.provider.providerNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Agrega la cedula a el proveedor
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlAddIdentificationCard(req: Request, res: Response): Promise<void> {
		try {
			const providerService = new ProviderService();
			const uploadService = new UploadService();

			// Search provider
			const provider: Provider = await providerService.getOne(req.body.id);


			// Sanitize data
			//sanitize(provider);

			// Update objeto with pictures
			/* provider.identificationCard = await uploadService.upload(
				req.body.identificationCard, `${provider.id}-identificationCard`); */

			// Save changes
			const dataProvider: Provider = await providerService.saveChanges(provider);
			HttpResponseService.response(res, 200, dataProvider, messages.provider.providerAddIdentificationCard);

		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}
}
