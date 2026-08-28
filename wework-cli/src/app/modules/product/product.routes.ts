import { Routes } from '@angular/router';
import { ProductIndexComponent } from './pages/product-index/product-index.component'; 
import { ProductListComponent } from './components/product-list/product-list.component'; // 👈 Importa la lista

export const PRODUCT_ROUTES: Routes = [
    {
        path: '', 
        component: ProductIndexComponent,
        children: [
            {
                path: '', 
                component: ProductListComponent 
            }
        ]
    }
];