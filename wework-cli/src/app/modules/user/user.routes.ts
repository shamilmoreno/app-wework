import { Routes } from '@angular/router';
import { UserIndexComponent } from './pages/user-index/user-index.component';

export const USER_ROUTES: Routes = [
    {
        path: '', 
        component: UserIndexComponent
    }
];
