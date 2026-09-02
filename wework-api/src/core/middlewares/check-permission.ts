import { NextFunction, Request, Response } from "express";
import { HttpResponseService } from "../services/http-response.service";
import messages from "../helpers/messages";

// Aplana los permisos del usuario en un solo arreglo de nombres, ej: ["product:view", "product:create"]
function getUserPermissionNames(user: any): string[] {
	const userRoles = user.userRoles ?? [];
	const names: string[] = [];

	for (const userRole of userRoles) {
		const rolePermissions = userRole.role?.rolePermissions ?? [];
		for (const rolePermission of rolePermissions) {
			if (rolePermission.permission?.isActive) {
				names.push(rolePermission.permission.name);
			}
		}
	}

	return names;
}

// Middleware "factory": genera un middleware específico para el permiso que le pases
export const checkPermission = (requiredPermission: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = (req as any).user;

		if (!user) {
			return HttpResponseService.response(res, 401, null, messages.jwt.userInvalid);
		}

		const userPermissions = getUserPermissionNames(user);

		if (!userPermissions.includes(requiredPermission)) {
			return HttpResponseService.response(res, 403, null, "No tienes permiso para realizar esta acción");
		}

		next();
	};
};
