import { RolePermissionDetailModel } from "./role-permission-detail.model";

export class RoleModel {
	id?: number;
	name?: string;
	rolePermissions?: RolePermissionDetailModel[];
}
