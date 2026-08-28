import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { InventoryModel } from '@core/models/inventory.model';
import { ActionEventModel } from '@core/models/action-event.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryStoreService {
  // Lista de inventario
  private inventoryListSubject = new BehaviorSubject<InventoryModel[]>([]);
  inventoryList$ = this.inventoryListSubject.asObservable();

  // Producto seleccionado (para historial)
  private selectedProductSubject = new BehaviorSubject<InventoryModel | null>(null);
  selectedProduct$ = this.selectedProductSubject.asObservable();

  // Historial de entradas de un producto
  private inventoryEntryHistorySubject = new BehaviorSubject<any[]>([]);
  inventoryEntryHistory$ = this.inventoryEntryHistorySubject.asObservable();

  // Historial de salidas de un producto
  private inventoryOutHistorySubject = new BehaviorSubject<any[]>([]);
  inventoryOutHistory$ = this.inventoryOutHistorySubject.asObservable();

  // Accion emitida desde componente Dumb
  private actionSubject = new Subject<ActionEventModel>();
  action$ = this.actionSubject.asObservable();

  private searchTitleSubject = new BehaviorSubject<string>('');

  public searchTitle$ = this.searchTitleSubject.asObservable();

  // Métodos para actualizar el store
  public setInventoryList(list: InventoryModel[]) {
    this.inventoryListSubject.next(list); /*  */
  }

  public setSelectedProduct(product: InventoryModel) {
    this.selectedProductSubject.next(product);
  }

  public setInventoryEntryHistory(history: any[]) {
    this.inventoryEntryHistorySubject.next(history);
  }

  public setInventoryOutHistory(history: any[]) {
    this.inventoryOutHistorySubject.next(history);
  }

  public dispatch(action: ActionEventModel) {
    this.actionSubject.next(action);
  }

  public setSearchTitle(title: string): void {
    this.searchTitleSubject.next(title);
  }
}
