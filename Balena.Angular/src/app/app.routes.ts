import { Routes } from '@angular/router';
import { AdminRoutes } from './Admin/Components/admin.routes';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'not-authorized',
        loadComponent: () => import('./Auth/not-authorized/not-authorized.component').then(m => m.NotAuthorizedComponent)
    },
    ...AdminRoutes
];
