import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';

// MODELS
import { UserModel } from '@core/models/user.model';
import { RoleModel } from '@core/models/role.model';
import { ResponseModel } from '@core/models/response.model';

@Injectable({
	providedIn: 'root'
})

export class UserService {
	constructor(private httpClient: HttpClient) { }

	public list(): Observable<ResponseModel> {
		return this.httpClient.get<ResponseModel>(`${environment.serverPath}/user`);
	}

	public create(user: UserModel): Observable<ResponseModel> {
		return this.httpClient.post<ResponseModel>(`${environment.serverPath}/user`, user);
	}

	public update(user: UserModel): Observable<ResponseModel> {
		return this.httpClient.put<ResponseModel>(`${environment.serverPath}/user`, user);
	}

	public byId(id: number): Observable<ResponseModel> {
		return this.httpClient.get<ResponseModel>(`${environment.serverPath}/user/${id}`);
	}

	public detail(id: number): Observable<ResponseModel> {
		return this.httpClient.get<ResponseModel>(`${environment.serverPath}/user/${id}/detail`);
	}

	public dataValidationOfCustomer(user: UserModel): Observable<ResponseModel> {
		return this.httpClient.post<ResponseModel>(`${environment.serverPath}/user/data-validation`, user);
	}

	public delete(userId: number): Observable<ResponseModel> {
		return this.httpClient.delete<ResponseModel>(`${environment.serverPath}/user/${userId}`);
	}

	public save(user: number, products: UserModel[]) {
		return this.httpClient.post<ResponseModel>(`${environment.serverPath}/user/products`, {
			id: user,
			products: products
		});
	}

	public saveRoles(userId: number, roles: RoleModel[]) {
		return this.httpClient.post<ResponseModel>(`${environment.serverPath}/user/roles`, {
			id: userId,
			roles: roles
		});
	}

	public removeRoles(userId: number) {
		return this.httpClient.delete<ResponseModel>(`${environment.serverPath}/user/${userId}/roles`);
	}
}
