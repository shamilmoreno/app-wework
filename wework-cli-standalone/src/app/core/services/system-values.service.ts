import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponseModel } from '@core/models/response.model';
import { Observable } from 'rxjs';
import { SubcategoryModel } from '../../core/models/subcategory.model';

@Injectable({
  providedIn: 'root'
})
export class SystemValuesService {

  constructor(private http: HttpClient) {}

  public list() {
    return this.http.get(`${ environment.server }/category`);
  }

  public getSubcategoriesByCategoryNem(categoryNem: string): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${ environment.server }/category/${ categoryNem }`);
  }

  public createSubcategory(subcategory: SubcategoryModel) {
    return this.http.post(`${ environment.server }/subcategory`, subcategory);
  }

  public editSubcategory(subcategory: SubcategoryModel) {
    return this.http.put(`${ environment.server }/subcategory`, subcategory);
  }

  public removeSubcategory(subcategoryId: number) {
    return this.http.delete(`${ environment.server }/subcategory/${ subcategoryId }`);
  }
}
