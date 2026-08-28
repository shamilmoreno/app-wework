import { Routes } from '@angular/router';
import { AdministratorComponent } from './pages/administrator/administrator.component';

export const ADMIN_ROUTES: Routes = [
	{
		path: '',
		component: AdministratorComponent,
		children: [
			{
				path: '',
				redirectTo: 'dashboard',
				pathMatch: 'full',
			},
			{
				path: 'welcome',
				loadChildren: () => import('../home/home.routes').then((m) => m.HOME_ROUTES),
			},
			{
				path: 'dashboard',
				loadChildren: () =>
					import('./pages/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
			},
			{
				path: 'setting',
				loadChildren: () => import('./pages/setting/setting.routes').then((m) => m.SETTING_ROUTES),
			},
			{
				path: 'bag-recipe',
				loadChildren: () => import('../bag-recipe/bag-recipe.routes').then((m) => m.RECIPE_ROUTES),
			},
			{
				path: 'inventory',
				loadChildren: () => import('../inventory/inventory.routes').then((m) => m.INVENTORY_ROUTES),
			},
			{
				path: 'product',
				loadChildren: () => import('../product/product.routes').then((m) => m.PRODUCT_ROUTES),
			},
			{
				path: 'warehouse',
				loadChildren: () => import('../warehouse/warehouse.routes').then((m) => m.WAREHOUSE_ROUTES),
			},
			{
				path: 'user',
				loadChildren: () => import('../user/user.routes').then((m) => m.USER_ROUTES),
			},
		],
	},
];
