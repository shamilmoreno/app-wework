import { sanitize } from 'class-sanitizer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { getCurrentDate } from '../../core/helpers/str-utils';
import { NotificationMiddleware } from '../../core/middlewares/notification.middleware';
import { HttpResponseService } from '../../core/services/http-response.service';
import { CustomerService } from '../../core/services/customer.service';
import { UploadService } from '../../core/services/upload.service';
import { Customer } from '../../database/entities/customer';


// MODELS
import { CustomerDataModel } from '../../core/models/customer-data.model ';

export class CustomerController {
	/**
	 * Cargar todos los clientes de la base de datos
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const customerService = new CustomerService();
			const customer: Customer[] = await customerService.list();
			HttpResponseService.response(res, 200, customer, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar clientes por Id
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOne(req: Request, res: Response): Promise<void> {
		try {
			// Find customer
			const customerService = new CustomerService();

			// Find customer
			const customer: Customer = await customerService.getOne(parseInt(req.params.id));

			// Valid the info
			if (customer) {
				HttpResponseService.response(res, 200, customer, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.customer.customerNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	* Crear a un nuevo cliente 
	* @param req Solicitud
	* @param res Respuesta
	*/
	public async ctrlCreate(req: Request, res: Response): Promise<void> {
		try {
			const customerService = new CustomerService();

			// Creating a instance of User
			const customer = new Customer();
			customer.businessName = req.body.businessName;
			customer.documentType = req.body.documentType;
			customer.documentNumber = req.body.documentNumber;
			customer.phone = req.body.phone;
			customer.email = req.body.email;
			customer.address = req.body.address;

			console.log('El cliente que llega', req.body)


			customer.createdAt = getCurrentDate();

			// Validate data Costumer
			const custumer = await validate(customer);
			if (custumer.length > 0) {
				HttpResponseService.response(res, 400, custumer, messages.general.error);
			}

			// Sanitize data
			sanitize(customer);

			console.log('El ciente a guardar', customer)

			// Save Changes
			const result = await customerService.saveChanges(customer);
			HttpResponseService.response(res, 200, result, messages.customer.customerCreated);
		} catch (error) {
			if (error.detail.search('documentNumber') !== -1) {
				HttpResponseService.response(res, 500, error, messages.customer.customerDocumentNumberExists);
			} else {
				HttpResponseService.response(res, 500, error, messages.general.error);
			}
		}
	}

	/**
	 * Actualización de un cliente
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlUpdate(req: Request, res: Response): Promise<void> {
		try {
			const customerService = new CustomerService();

			// Find Costumer
			const customer: Customer = await customerService.getOne(req.body.id);

			// Return data
			if (customer) {
				customer.businessName = req.body.businessName;
				customer.documentType = req.body.documentType;
				customer.documentNumber = req.body.documentNumber;
				customer.email = req.body.email;
				customer.phone = req.body.phone;
				customer.address = req.body.address;customer.customerType = req.body.customerType;

				// Validate data Costumer
				const custumer = await validate(customer);
				if (custumer.length > 0) {
					HttpResponseService.response(res, 400, custumer, messages.general.error);
				}

				// Sanitize data
				sanitize(customer);

				// Save Changes
				const result = await customerService.saveChanges(customer);
				HttpResponseService.response(res, 200, result, messages.customer.customerUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.customer.customerNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar cliente para validar la información
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOneForDataValidation(req: Request, res: Response): Promise<void> {
		try {
			// Find Clientes Residencial
			const customerService = new CustomerService();

			// Creating a instance of Customer
			const dt = req.body.documentType;
			const dn = req.body.documentNumber;

			// Find Customer Residencial
			const customer: Customer = await customerService.getOneForDataValidation(dt, dn);


			// Valid the info
			if (customer) {
				HttpResponseService.response(res, 200, customer, messages.customer.customerDataValidationSuccess);
			} else {
				HttpResponseService.response(res, 404, null, messages.customer.customerNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar detalle del cliente
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOneForDetail(req: Request, res: Response): Promise<void> {
		try {
			const customerController = new CustomerController();
			const customerService = new CustomerService();

			// Find Customer
			const customer: Customer = await customerService.getOneForDetail(parseInt(req.params.id));
			console.log('CLIENTEEEEEEEEEE', customer);

			// Build the info
			const data = await customerController.getStructureData(customer);

			// Valid the info
			if (data) {
				HttpResponseService.response(res, 200, data, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.customer.customerNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Eliminar cliente
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			// Search Doctor
			const customerService = new CustomerService();
			const customer: Customer = await customerService.getOne(parseInt(req.params.id));
			const notificationMiddleware = new NotificationMiddleware();

			// Return data
			if (customer) {
				// Create a notification
				/* notificationMiddleware.createCustumerDelete({
					data: {
						customer: `${customer.businessName}`,
					},
				}); */

				// Result
				const data = await customerService.remove(customer.id);
				HttpResponseService.response(res, 200, data, messages.customer.customerDeleted);
			} else {
				HttpResponseService.response(res, 404, null, messages.customer.customerNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Agrega la cedula a el cliente
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlAddIdentificationCard(req: Request, res: Response): Promise<void> {
		try {
			const customerService = new CustomerService();
			const uploadService = new UploadService();

			// Search patient
			const customer: Customer = await customerService.getOne(req.body.id);


			// Sanitize data
			//sanitize(customer);

			// Update objeto with pictures
			customer.identificationCard = await uploadService.upload(
				req.body.identificationCard, `${customer.id}-identificationCard`);

			// Save changes
			const dataCustomer: Customer = await customerService.saveChanges(customer);
			HttpResponseService.response(res, 200, dataCustomer, messages.customer.customerAddIdentificationCard);

		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
* Obtener la estructura de los datos
* @param customer proforma
*/
	public async getStructureData(customer: Customer): Promise<CustomerDataModel> {
		try {
			let data: CustomerDataModel;
			data = {
				id: customer.id,
				businessName: customer.businessName,
				documentNumber: customer.documentNumber,
				identificationCard: customer.identificationCard,
				email: customer.email,
				address: customer.address,
				phone: customer.phone,
				createdAt: customer.createdAt,

				documentType: customer.documentType,
				customerType: customer.customerType,
				proformaPaid: [],
				pendingProforma: []
			};

			// Return data
			return data;
		} catch (error) {
			console.log(error);
		}
	}

}
