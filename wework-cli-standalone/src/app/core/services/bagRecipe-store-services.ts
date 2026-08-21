import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BagRecipeModel } from '@core/models/bag-recipe.model';
import { ActionEventModel } from '@core/models/action-event.model';

@Injectable({
    providedIn: 'root'
})
export class BagRecipeStoreService {
    private bagRecipeListSubject = new BehaviorSubject<BagRecipeModel[]>([]);
    bagRecipeList$ = this.bagRecipeListSubject.asObservable();

    private selectedProductSubject = new BehaviorSubject<BagRecipeModel | null>(null);
    selectedProduct$ = this.selectedProductSubject.asObservable();

    private bagRecipeEntryHistorySubject = new BehaviorSubject<any[]>([]);
    bagRecipeEntryHistory$ = this.bagRecipeEntryHistorySubject.asObservable();

    private bagRecipeOutHistorySubject = new BehaviorSubject<any[]>([]);
    bagRecipeOutHistory$ = this.bagRecipeOutHistorySubject.asObservable();

    private actionSubject = new Subject<ActionEventModel>();
    action$ = this.actionSubject.asObservable();

    private searchTitleSubject = new BehaviorSubject<string>('');

    public searchTitle$ = this.searchTitleSubject.asObservable();

    public setBagRecipeList(list: BagRecipeModel[]) {
        this.bagRecipeListSubject.next(list);/*  */
    }

    public setSelectedProduct(product: BagRecipeModel) {
        this.selectedProductSubject.next(product);
    }

    public setBagRecipeEntryHistory(history: any[]) {
        this.bagRecipeEntryHistorySubject.next(history);
    }

    public setBagRecipeOutHistory(history: any[]) {
        this.bagRecipeOutHistorySubject.next(history);
    }

    public dispatch(action: ActionEventModel) {
        this.actionSubject.next(action);
    }

    public setSearchTitle(title: string): void {
        this.searchTitleSubject.next(title);
    }
}
