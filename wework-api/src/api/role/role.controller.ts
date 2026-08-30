import { sanitize } from "class-sanitizer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import messages from "../../core/helpers/messages";
import { getCurrentDate } from "../../core/helpers/str-utils";
import { NotificationMiddleware } from "../../core/middlewares/notification.middleware";
import { HttpResponseService } from "../../core/services/http-response.service";
import { UploadService } from "../../core/services/upload.service";
import { RolePermissionService } from "../../core/services/role-permission.service";

// MODELS
import { RoleModel } from "../../core/models/role.model";
import { RoleService } from "../../core/services/role.service";
import { Role } from "../../database/entities/role";
import { UserService } from "../../core/services/user.service";
import { User } from "../../database/entities/user";

export class RoleController {
	/**
	 * Cargar todos los Roles de la base de datos
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const roleService = new RoleService();
			const role: Role[] = await roleService.list();
			HttpResponseService.response(res, 200, role, "");
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar Rol por Id
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOne(req: Request, res: Response): Promise<void> {
		try {
			// Find role
			const roleService = new RoleService();

			// Find role
			const role: Role = await roleService.getOne(parseInt(req.params.id));

			// Valid the info
			if (role) {
				HttpResponseService.response(res, 200, role, "");
			} else {
				HttpResponseService.response(res, 404, null, messages.role.roleNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Crear a un nuevo rol
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlCreate(req: Request, res: Response): Promise<void> {
		try {
			const roleService = new RoleService();

			// Creating a instance of role
			const role = new Role();
			role.name = req.body.name;
			role.createdAt = getCurrentDate();

			// Validate data role
			const roleError = await validate(role);

			if (roleError.length > 0) {
				HttpResponseService.response(res, 400, roleError, messages.general.error);
			}

			// Sanitize data
			sanitize(role);

			// Save Changes
			const result = await roleService.saveChanges(role);
			HttpResponseService.response(res, 200, result, messages.role.roleCreated);
		} catch (error) {
			if (error.detail.search("identificationNumber") !== -1) {
				HttpResponseService.response(res, 500, error, messages.provider.providerNumberExists);
			} else {
				HttpResponseService.response(res, 500, error, messages.general.error);
			}
		}
	}

	/**
	 * Actualización de un role
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlUpdate(req: Request, res: Response): Promise<void> {
		try {
			const roleService = new RoleService();

			// Find Role
			const role: Role = await roleService.getOne(req.body.id);

			// Return data
			if (role) {
				role.name = req.body.name;

				// Validate data Role
				const roleError = await validate(role);
				if (roleError.length > 0) {
					HttpResponseService.response(res, 400, roleError, messages.general.error);
				}

				// Sanitize data
				sanitize(role);

				// Save Changes
				const result = await roleService.saveChanges(role);
				HttpResponseService.response(res, 200, result, messages.role.roleUpdated);
			} else {
				HttpResponseService.response(res, 404, null, messages.role.roleNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Asignar/reemplazar los permisos de un rol
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlSetPermissions(req: Request, res: Response): Promise<void> {
		try {
			const roleService = new RoleService();
			const rolePermissionService = new RolePermissionService();

			const roleId = parseInt(req.params.id);
			const role: Role = await roleService.getOne(roleId);

			if (!role) {
				HttpResponseService.response(res, 404, null, messages.role.roleNotFound);
				return;
			}

			const permissionIds: number[] = req.body.permissionIds || [];

			await rolePermissionService.setPermissionsForRole(roleId, permissionIds);
			HttpResponseService.response(res, 200, null, "Permisos del rol actualizados correctamente");
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar detalle del role
	 * @param res Respuesta
	 */
	public async ctrlGetOneForDetail(req: Request, res: Response): Promise<void> {
		try {
			const roleController = new RoleController();
			const roleService = new RoleService();

			// Find Role
			const role: Role = await roleService.getOneForDetail(parseInt(req.params.id));

			// Valid the info
			if (role) {
				HttpResponseService.response(res, 200, role, "");
			} else {
				HttpResponseService.response(res, 404, null, messages.role.roleNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Eliminar rol
	 * @param res Respuesta
	 */
	public async ctrlRemove(req: Request, res: Response): Promise<void> {
		try {
			// Search Role
			const roleService = new RoleService();
			const role: Role = await roleService.getOne(parseInt(req.params.id));
			const notificationMiddleware = new NotificationMiddleware();

			// Return data
			if (role) {
				// Create a notification
				/* notificationMiddleware.createDelete({
					data: {
						role: `${role.name}`,
					},
				}); */

				// Result
				const data = await roleService.remove(role.id);
				HttpResponseService.response(res, 200, data, messages.role.roleDeleted);
			} else {
				HttpResponseService.response(res, 404, null, messages.role.roleNotFound);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}
}
