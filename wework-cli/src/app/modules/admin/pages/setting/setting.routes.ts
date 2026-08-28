import { Routes } from '@angular/router';

export const SETTING_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'system-value/index',
        pathMatch: 'full'
    },
    {
        path: 'system-value',
        children: [
            {
                path: 'index',
                loadComponent: () =>
                    import('./system-value/system-value-index/system-value-index.component').then(m => m.SystemValueIndexComponent)
            },
            {
                path: 'list',
                loadComponent: () =>
                    import('./system-value/system-value-list/system-value-list.component').then(m => m.SystemValueListComponent)
            },
            {
                path: 'manage',
                loadComponent: () =>
                    import('./system-value/system-value-manage/system-value-manage.component').then(m => m.SystemValueManageComponent)
            }
        ]
    },
    {
        path: 'user',
        children: [
            {
                path: 'list',
                loadComponent: () =>
                    import('./user/containers/user-index/user-index.component').then(m => m.UserIndexComponent)
            }
            // Si tienes más rutas dentro de user (como 'profile' o 'add'), agrégalas aquí siguiendo el mismo patrón
        ]
    }
];
