import { Request, Response } from "express";
import messages from "../../core/helpers/messages";
import { HttpResponseService } from "../../core/services/http-response.service";

import { PermissionService } from "../../core/services/permission.service";
import { Permission } from "../../database/entities/permission";

export class PermissionController {
	/**
	 * Cargar todos los Permisos de la base de datos
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlList(req: Request, res: Response): Promise<void> {
		try {
			const permissionService = new PermissionService();
			const permission: Permission[] = await permissionService.listActive();
			HttpResponseService.response(res, 200, permission, "");
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Cargar Permiso por Id
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlGetOne(req: Request, res: Response): Promise<void> {
		try {
			const permissionService = new PermissionService();
			const permission: Permission = await permissionService.getOne(parseInt(req.params.id));

			if (permission) {
				HttpResponseService.response(res, 200, permission, "");
			} else {
				HttpResponseService.response(res, 404, null, "Permiso no encontrado");
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}
}
