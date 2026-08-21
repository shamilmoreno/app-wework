import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { WareHouseModel } from "@core/models/wareHouse.model"; // Tu modelo limpio
import { ActionEventModel } from '@core/models/action-event.model';

@Injectable({
    providedIn: 'root'
})
export class WareHouseStoreService {
    // 1. Estado de la lista global de almacenes
    private wareHouseListSubject = new BehaviorSubject<WareHouseModel[]>([]);
    warehouseList$ = this.wareHouseListSubject.asObservable();

    // 2. Estado del almacén seleccionado actualmente en el Navbar (¡Crucial para filtrar el resto de la app!)
    private activeWareHouseSubject = new BehaviorSubject<WareHouseModel | null>(null);
    activeWarehouse$ = this.activeWareHouseSubject.asObservable();

    // 3. Acciones emitidas desde componentes Dumb (tablas/formularios)
    private actionSubject = new Subject<ActionEventModel>();
    action$ = this.actionSubject.asObservable();

    private searchTitleSubject = new BehaviorSubject<string>('');

    public searchTitle$ = this.searchTitleSubject.asObservable();

    // === Métodos para actualizar el estado ===
    public setWareHouseList(list: WareHouseModel[]) {
        this.wareHouseListSubject.next(list);
    }

    public setActiveWareHouse(warehouse: WareHouseModel | null) {
        this.activeWareHouseSubject.next(warehouse);
    }

    public dispatch(action: ActionEventModel) {
        this.actionSubject.next(action);
    }

    public setSearchTitle(title: string): void {
        this.searchTitleSubject.next(title);
    }
}