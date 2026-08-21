import { Injectable } from '@angular/core';
import { InventoryModel } from '@core/models/inventory.model';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '@core/models/response.model';
import { Observable } from 'rxjs';
import { environment } from '@envs/environment';

@Injectable()
export class InventoryService {
  constructor(private http: HttpClient) { }

  public list(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${environment.server}/inventory`);
  }

  public update(inventory: InventoryModel): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${environment.server}/inventory`, inventory);
  }

  public byId(id: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${environment.server}/inventory/${id}`);
  }

  public detail(id: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${environment.server}/inventory/${id}/detail`);
  }

  public delete(inventoryId: number): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${environment.server}/inventory/${inventoryId}`);
  }

  // INVENTORY MOVEMENTS
  public listMovement(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${environment.server}/inventory-movements`);
  }

  public create(inventory: InventoryModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${environment.server}/inventory/movement`, inventory);
  }

  public listOfMovements(id: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${environment.server}/inventory/${id}/movements`);
  }
}
