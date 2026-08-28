import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';

// MODELS
import { WareHouseModel } from '../models/wareHouse.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
	providedIn: 'root'
})

export class WareHouseService {
	constructor(private httpClient: HttpClient) { }

	public list(): Observable<ResponseModel> {
		return this.httpClient.get<ResponseModel>(`${environment.serverPath}/wareHouse`);
	}

	public create(wareHouse: WareHouseModel): Observable<ResponseModel> {
		return this.httpClient.post<ResponseModel>(`${environment.serverPath}/wareHouse`, wareHouse);
	}

	public update(wareHouse: WareHouseModel): Observable<ResponseModel> {
		return this.httpClient.put<ResponseModel>(`${environment.serverPath}/wareHouse`, wareHouse);
	}

	public byId(id: number): Observable<ResponseModel> {
		return this.httpClient.get<ResponseModel>(`${environment.serverPath}/wareHouse/${id}`);
	}

	public detail(id: number): Observable<ResponseModel> {
		return this.httpClient.get<ResponseModel>(`${environment.serverPath}/wareHouse/${id}/detail`);
	}

	public delete(wareHouseId: number): Observable<ResponseModel> {
		return this.httpClient.delete<ResponseModel>(`${environment.server}/wareHouse/${wareHouseId}`);
	}
}
