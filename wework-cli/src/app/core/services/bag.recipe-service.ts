import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BagRecipeModel } from '@core/models/bag-recipe.model';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '@core/models/response.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentDetailModel } from '@core/models/bag-recipe-payment.model';
import { BagRecipeMaquiladorModel } from '@core/models/bag-recipe-maquilador.model';

@Injectable()
export class BagRecipeService {
	constructor(private http: HttpClient) { }

	public list(): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/bag-recipe`);
	}

	public create(recipeBag: BagRecipeModel): Observable<ResponseModel> {
		return this.http.post<ResponseModel>(`${environment.server}/bag-recipe`, recipeBag);
	}

	public update(recipeBag: BagRecipeModel): Observable<ResponseModel> {
		return this.http.put<ResponseModel>(`${environment.server}/bag-recipe`, recipeBag);
	}

	public byId(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/bag-recipe/${id}`);
	}

	public detail(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/bag-recipe/${id}/detail`);
	}

	public dataValidationOfCustomer(recipeBag: BagRecipeModel): Observable<ResponseModel> {
		return this.http.post<ResponseModel>(`${environment.server}/bag-recipe/data-validation`, recipeBag);
	}

	public disableItem(recipeBag: BagRecipeModel): Observable<ResponseModel> {
		return this.http.patch<ResponseModel>(`${environment.server}/bag-recipe`, recipeBag);
	}

	public delete(recipeBagId: number): Observable<ResponseModel> {
		return this.http.delete<ResponseModel>(`${environment.server}/bag-recipe/${recipeBagId}`);
	}

	public listOfItem(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/bag-recipe/${id}/products`);
	}

	public listOfPayment(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/bag-recipe/${id}/payments`);
	}

	public getSummary(filterNumber: number | any) {
		return this.http.get<ResponseModel>(`${environment.server}/bag-recipe/summary/${filterNumber}`);
	}

	public getSummarySpecificMonth(date: any) {
		return this.http.get<ResponseModel>(`${environment.server}/bag-recipe/summary/${date}`);
	}

	public saveMaquiladors(recipeBagId: number, maquiladors: BagRecipeMaquiladorModel[]) {
		return this.http.post<ResponseModel>(`${environment.server}/bag-recipe/maquiladors`, {
			id: recipeBagId,
			maquiladors: maquiladors
		});
	}

	public removeMaquiladors(recipeBagId: number) {
		return this.http.delete<ResponseModel>(`${environment.server}/bag-recipe/${recipeBagId}/maquiladors`);
	}

	public saveProducts(recipeBagId: number, products: BagRecipeModel[]) {
		return this.http.post<ResponseModel>(`${environment.server}/bag-recipe/products`, {
			id: recipeBagId,
			products: products
		});
	}

	public removeProducts(recipeBagId: number) {
		return this.http.delete<ResponseModel>(`${environment.server}/bag-recipe/${recipeBagId}/products`);
	}

	public savePayments(recipeBagId: number, payments: PaymentDetailModel[]) {
		return this.http.post<ResponseModel>(`${environment.server}/bag-recipe/payments`, {
			id: recipeBagId,
			payments: payments
		});
	}

	public removePayments(recipeBagId: number) {
		return this.http.delete<ResponseModel>(`${environment.server}/bag-recipe/${recipeBagId}/payments`);
	}

	public addIdentificationCard(recipeBag: BagRecipeModel): Observable<ResponseModel> {
		return this.http.put<ResponseModel>(`${environment.server}/customer/identification-card`, recipeBag);
	}
}
