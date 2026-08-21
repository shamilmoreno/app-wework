import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./modules/authentication/authentication.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: '',
        loadChildren: () => import('./modules/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'auth',
    },
];
