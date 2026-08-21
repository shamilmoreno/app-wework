import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductModel } from '@core/models/product.model';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '@core/models/response.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ProductService {
	constructor(private http: HttpClient) { }

	public list(): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/product`);
	}

	public create(product: ProductModel): Observable<ResponseModel> {
		return this.http.post<ResponseModel>(`${environment.server}/product`, product);
	}

	public update(product: ProductModel): Observable<ResponseModel> {
		return this.http.put<ResponseModel>(`${environment.server}/product`, product);
	}

	public byId(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/product/${id}`);
	}

	public detail(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/product/${id}/detail`);
	}

	public dataValidationOfCustomer(product: ProductModel): Observable<ResponseModel> {
		return this.http.post<ResponseModel>(`${environment.server}/product/data-validation`, product);
	}

	public delete(recipeBagId: number): Observable<ResponseModel> {
		return this.http.delete<ResponseModel>(`${environment.server}/product/${recipeBagId}`);
	}

	public listOfItem(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/product/${id}/products`);
	}

	public listOfPayment(id: number): Observable<ResponseModel> {
		return this.http.get<ResponseModel>(`${environment.server}/product/${id}/payments`);
	}

	public getSummary(filterNumber: number) {
		return this.http.get<ResponseModel>(`${environment.server}/product/summary/${filterNumber}`);
	}

	public saveProducts(recipeBagId: number, products: ProductModel[]) {
		return this.http.post<ResponseModel>(`${environment.server}/product/products`, {
			id: recipeBagId,
			products: products
		});
	}

	public addIdentificationCard(product: ProductModel): Observable<ResponseModel> {
		return this.http.put<ResponseModel>(`${environment.server}/customer/identification-card`, product);
	}
}
