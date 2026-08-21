import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component'; // Ajusta si el nombre de la clase cambia

export const AUTH_ROUTES: Routes = [
    {
        path: '', // Ruta base del grupo (ej: /auth)
        children: [
            { path: 'login', component: LoginComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    }
];
