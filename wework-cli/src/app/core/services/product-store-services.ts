import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProductModel } from '@core/models/product.model';
import { ActionEventModel } from '@core/models/action-event.model';

@Injectable({
    providedIn: 'root'
})
export class ProductStoreService {
    private productListSubject = new BehaviorSubject<ProductModel[]>([]);
    productList$ = this.productListSubject.asObservable();

    private selectedProductSubject = new BehaviorSubject<ProductModel | null>(null);
    selectedProduct$ = this.selectedProductSubject.asObservable();

    private productEntryHistorySubject = new BehaviorSubject<any[]>([]);
    productEntryHistory$ = this.productEntryHistorySubject.asObservable();

    private productOutHistorySubject = new BehaviorSubject<any[]>([]);
    productOutHistory$ = this.productOutHistorySubject.asObservable();

    private actionSubject = new Subject<ActionEventModel>();
    action$ = this.actionSubject.asObservable();

    private searchTitleSubject = new BehaviorSubject<string>('');

    public searchTitle$ = this.searchTitleSubject.asObservable();

    public setProductList(list: ProductModel[]) {
        this.productListSubject.next(list);/*  */
    }

    public setSelectedProduct(product: ProductModel) {
        this.selectedProductSubject.next(product);
    }

    public setProductEntryHistory(history: any[]) {
        this.productEntryHistorySubject.next(history);
    }

    public setProductOutHistory(history: any[]) {
        this.productOutHistorySubject.next(history);
    }

    public dispatch(action: ActionEventModel) {
        this.actionSubject.next(action);
    }

    public setSearchTitle(title: string): void {
        this.searchTitleSubject.next(title);
    }
}
