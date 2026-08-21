import { Routes } from '@angular/router';
import { WareHouseIndexComponent } from './pages/warehouse-index/warehouse-index.component';
import { WareHouseListComponent } from './components/warehouse-list/warehouse-list.component';

export const WAREHOUSE_ROUTES: Routes = [
      {
            path: '', 
            component: WareHouseIndexComponent,
            children: [
                {
                    path: '', 
                    component: WareHouseListComponent 
                }
            ]
        }
];
