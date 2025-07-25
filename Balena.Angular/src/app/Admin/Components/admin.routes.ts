import { Routes } from '@angular/router';

export const AdminRoutes: Routes = [
    {
        path: 'admin',
        loadComponent: () => import('./admin-layout.component').then(m => m.AdminLayoutComponent),
        children: [
            {
                path: 'home',
                loadComponent: () => import('../Shared/admin-home/admin-home.component').then(m => m.AdminHomeComponent),
            },
            {
                path: 'all-pages-design',
                loadComponent: () => import('./all-pages-design/all-pages-design.component').then(m => m.AllPagesDesignComponent),
            },
            { path: '', redirectTo: 'home', pathMatch: 'full' },
        ]
    },
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
