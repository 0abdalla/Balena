import { Routes } from '@angular/router';
import { AdminRoutes } from './Admin/Components/admin.routes';
import { authGuard } from './Auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'not-authorized',
        loadComponent: () => import('./Auth/not-authorized/not-authorized.component').then(m => m.NotAuthorizedComponent)
    },
    {
        path: 'create-order',
        loadComponent: () => import('./Admin/Components/create-order/create-order.component').then(m => m.CreateOrderComponent),
        canActivate: [authGuard]
    },
    ...AdminRoutes
];
