import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseModel } from "../models/response.model";
import { environment } from "../../../environments/environment";

@Injectable()
export class PermissionService {
	constructor(private http: HttpClient) {}

	public list(): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/permission`);
	}

	public byId(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/permission/${id}`);
	}
}
