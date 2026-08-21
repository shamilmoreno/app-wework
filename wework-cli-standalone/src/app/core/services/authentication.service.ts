import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';

// MODELS
import { AuthenticationModel } from '../models/authentication.model';
import { ResponseModel } from '@core/models/response.model';

@Injectable({
	providedIn: 'root'
})

export class AuthenticationService {
	constructor(private httpClient: HttpClient) { }

	public login(auth: AuthenticationModel): Observable<ResponseModel> {
		return this.httpClient.post<ResponseModel>(`${environment.serverPath}/auth/login`, auth);
	}

/* 	public logout(): Observable<ResponseModel> {
		return this.httpClient.delete<ResponseModel>(`${environment.serverPath}/auth/logout`);
	} */

	public logout(): Observable<ResponseModel> {
		return this.httpClient.delete<ResponseModel>(`${environment.serverPath}/auth/logout`);
	}

	public requestChangePassword(auth: AuthenticationModel): Observable<ResponseModel> {
		return this.httpClient.post<ResponseModel>(`${environment.serverPath}/auth/request-change-password`, auth);
	}

	public validateToken(token: string): Observable<ResponseModel> {
		return this.httpClient.get<ResponseModel>(`${environment.serverPath}/auth/validate/${token}`);
	}

	public refreshToken(token: string): Observable<ResponseModel> {
		return this.httpClient.post<ResponseModel>(`${environment.serverPath}/auth/refresh`, token);
	}


	public changePassword(auth: AuthenticationModel): Observable<ResponseModel> {
		return this.httpClient.patch<ResponseModel>(`${environment.serverPath}/auth/change-password`, auth);
	}

}
