import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CompanyModel } from '@core/models/company.model';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '@core/models/response.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class CompanyService {
	constructor(private http: HttpClient) { }

	public list(): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/company`);
	}

	public create(company: CompanyModel): Observable<ResponseModel> {
		return this.http.post<ResponseModel>(`${environment.server}/company`, company);
	}

	public update(company: CompanyModel): Observable<ResponseModel> {
		return this.http.put<ResponseModel>(`${environment.server}/company`, company);
	}

	public byId(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/company/${id}`);
	}

	public detail(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/company/${id}/detail`);
	}

	public dataValidationOfCustomer(company: CompanyModel): Observable<ResponseModel> {
		return this.http.post<ResponseModel>(`${environment.server}/company/data-validation`, company);
	}

	public disableItem(company: CompanyModel): Observable<ResponseModel> {
		return this.http.patch<ResponseModel>(`${environment.server}/company`, company);
	}

	public delete(companyId: number): Observable<ResponseModel> {
		return this.http.delete<ResponseModel>(`${environment.server}/company/${companyId}`);
	}
}
