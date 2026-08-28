import { sanitize } from 'class-sanitizer';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { UserService } from '../../core/services/user.service';
import { UserRoleService } from '../../core/services/user-role.service';
import { HttpResponseService } from '../../core/services/http-response.service';
import { User } from '../../database/entities/user';
import { UserRole } from '../../database/entities/user.role';

export class UserRoleController {
	/**
	 * Carga todos los Roles de un usuario
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlListByUserId(req: Request, res: Response): Promise<void> {
		try {
			const userRoleService = new UserRoleService();
			const userRole: UserRole[] = await userRoleService.listByUsertId(parseInt(req.params.id));
			HttpResponseService.response(res, 200, userRole, '');
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crear o actualizar los Roles de un user
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreateOrUpdate(req: Request, res: Response): Promise<void> {
		try {
			const userService = new UserService();
			const userRoleService = new UserRoleService();
			const roles: UserRole[] = req.body.roles;
			const newRoles: UserRole[] = [];

			// Find user
			const user: User = await userService.getOneOnlyObject(req.body.id);

			if (user) {
				// Delete all Roles
				await userRoleService.remove(user.id);

				// Working to add role
				if (roles.length > 0) {
					roles.forEach(async (element: any) => {
						const nRole = new UserRole();
						nRole.role = element;
						nRole.user = user;

						// Sanitize data
						sanitize(nRole);

						// Save on array
						newRoles.push(nRole);
					});

					// Save Changes
					await userRoleService.saveChanges(newRoles);
				}

				await userService.saveChanges(user);

				// Response
				HttpResponseService.response(res, 200, null, messages.user.userDetailUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.user.userNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Remueve los Roles de un usuario
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			const userService = new UserService();
			const userRoleService = new UserRoleService();

			// Find user
			const user: User = await userService.getOneOnlyObject(req.body.id);

			if (user) {
				// Delete all Roles
				await userRoleService.remove(user.id);

				// Response
				HttpResponseService.response(res, 200, null, messages.user.userDetailUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.user.userNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}
}
