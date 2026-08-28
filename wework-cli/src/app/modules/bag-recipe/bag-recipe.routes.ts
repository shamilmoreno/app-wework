import { Routes } from '@angular/router';
import { BagRecipeIndexComponent } from './pages/bag-recipe-index/bag-recipe-index.component';
import { BagRecipeListComponent } from './components/bag-recipe-list/bag-recipe-list.component';
import { BagRecipeSummaryComponent } from './pages/bag-recipe-summary/bag-recipe-summary.component';

export const RECIPE_ROUTES: Routes = [
    {
        path: '',
        component: BagRecipeIndexComponent,
        children: [
            {
                path: '',
                component: BagRecipeListComponent
            },
            {
                path: 'summary',
                component: BagRecipeSummaryComponent
            }
        ]
    }
];