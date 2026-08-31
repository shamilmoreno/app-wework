import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { RoleModel } from "@core/models/role.model";
import { HttpClient } from "@angular/common/http";
import { ResponseModel } from "@core/models/response.model";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable()
export class RoleService {
	constructor(private http: HttpClient) {}

	public list(): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/role`);
	}

	public create(role: RoleModel): Observable<ResponseModel> {
		return this.http.post<ResponseModel>(`${environment.server}/role`, role);
	}

	public update(role: RoleModel): Observable<ResponseModel> {
		return this.http.put<ResponseModel>(`${environment.server}/role`, role);
	}

	public byId(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/role/${id}`);
	}

	public detail(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/role/${id}/detail`);
	}

	public setPermissions(roleId: number, permissionIds: number[]): Observable<ResponseModel> {
		return this.http.put<ResponseModel>(`${environment.server}/role/${roleId}/permissions`, { permissionIds });
	}

	public delete(roleId: number): Observable<ResponseModel> {
		return this.http.delete<ResponseModel>(`${environment.server}/role/${roleId}`);
	}
}
