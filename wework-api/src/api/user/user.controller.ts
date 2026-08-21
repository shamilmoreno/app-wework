import { sanitize } from 'class-sanitizer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { HttpResponseService } from '../../core/services/http-response.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../database/entities/user';
import { NotificationMiddleware } from './../../core/middlewares/notification.middleware';
import moment from 'moment';
import { getCurrentDate } from '../../core/helpers/str-utils';

export class UserController {
	/**
  * Carga todos los embarques de la base de datos
  * @param req Solicitud
  * @param res Respuesta
  */
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const userService = new UserService();
			const users: User[] = await userService.list();
			HttpResponseService.response(res, 200, users, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}
	/**
	 * Buscar un usuario por el Id
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOne(req: Request, res: Response): Promise<void> {
		try {
			const userController = new UserController()
			const userService = new UserService();
			const id: number = Number.parseInt(req.params.id, 10);
			const user: User = await userService.getOne(id);
			const userNew = await userController.getStructureRole(user);
			if (user) {
				HttpResponseService.response(res, 200, userNew, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.user.userNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	   * Crea un nuevo usuario
	   * @param req Solicitud
	   * @param res Respuesta
	   */
	public async ctrlCreate(req: Request, res: Response): Promise<void> {
		try {
			moment.locale('es');
			const todayDate = moment();
			const userService = new UserService();/*  */

			// Creating a instance of User
			const user = new User();
			user.firstName = req.body.firstName;
			user.lastName = req.body.lastName;
			user.gender = req.body.gender
			user.email = req.body.email;
			user.password = '$2b$08$udVCQ.E/DMdtzW340oU.X.iJj85Jbq8YzZrWAavLy4mq9bBmhUSP6'
			user.createdAt = getCurrentDate();

			// Validate data user
			const userErrors = await validate(user);
			if (userErrors.length > 0) {
				HttpResponseService.response(res, 400, userErrors, messages.general.error);
			}

			// Sanitize data
			sanitize(user);

			// Save Changes
			const result = await userService.saveChanges(user);
			HttpResponseService.response(res, 200, result, messages.user.userCreated);
		} catch (error) {
			if (error.detail.search('email') !== -1) {
				HttpResponseService.response(res, 409, error, messages.user.userEmailtNumberExists);
			} else {
				HttpResponseService.response(res, 500, error, messages.general.error);
			}
		}
	}

	/**
	 * Actualizar los datos de un usuario
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlUpdate(req: Request, res: Response): Promise<void> {
		try {
			const userService = new UserService();
			const notificationMiddleware = new NotificationMiddleware();
			const id: number = Number.parseInt(req.body.id, 10);

			// Find user
			const user: User = await userService.getOne(id);
			if (!user) {
				HttpResponseService.response(res, 404, null, messages.user.userNotFound);
			}

			// Updating a instance of User
			user.firstName = req.body.firstName;
			user.lastName = req.body.lastName;
			user.email = req.body.email;
			user.gender = req.body.gender;
			user.email = user.email.toLowerCase();

			// Validate data
			const errors = await validate(user);
			if (errors.length > 0) {
				HttpResponseService.response(res, 400, errors, messages.general.error);
			}

			// Sanitize data
			sanitize(user);

			// Return data
			const result = await userService.saveUser(user);
			if (result) {
				// Create notification
				notificationMiddleware.createChangePersonalData();

				// Result
				HttpResponseService.response(res, 200, result, messages.user.userInfoUpdated);
			} else {
				HttpResponseService.response(res, 500, null, messages.user.userInfoUpdatedError);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, null, messages.general.error);
		}
	}

	/**
	 * Carga detalle para el usuario
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOneForDetail(req: Request, res: Response): Promise<void> {
		try {
			const userService = new UserService();
			const userController = new UserController();

			// Find User
			const user: User = await userService.getOne(parseInt(req.params.id));

			// Build the info
			const userDetail = await userController.getStructureRole(user);

			// Valid the info
			if (user) {
				HttpResponseService.response(res, 200, userDetail, '');
			} else {
				HttpResponseService.response(res, 404, null, messages.user.userNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Genera la estructura de los datos Role
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async getStructureRole(user: any) {
		try {
			let roleModificate: any[] = []
			user.roles.forEach((r: any) => {
				roleModificate.push(r.role.id);
			});
			user.roles = roleModificate;
			return user;
		} catch (error) {
			console.log(error);
		}
	}
}
