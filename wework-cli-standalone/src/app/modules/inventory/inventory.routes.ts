import { Routes } from '@angular/router';
import { InventoryIndexComponent } from './pages/inventory-index/inventory-index.component'; 
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';

export const INVENTORY_ROUTES: Routes = [
    {
        path: '', 
        component: InventoryIndexComponent,
        children: [
            {
                path: '', 
                component: InventoryListComponent 
            }
        ]
    }
];