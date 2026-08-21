import { WareHouseModel } from '@core/models/wareHouse.model';
import { RoleModel } from './role.model';

export class UserModel {
	id?: number;
	firstName?: string;
	lastName?: string;
	email?: string;
	token?: string;
	gender?: any; 
	userRoles?: RoleModel[];     
	warehouses?: WareHouseModel[]; 
	activeWarehouseId?: number | null;   
}