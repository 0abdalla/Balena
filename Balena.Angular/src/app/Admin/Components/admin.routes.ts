import { Routes } from '@angular/router';
import { authGuard } from '../../Auth/auth.guard';

export const AdminRoutes: Routes = [
    {
        path: 'admin',
        loadComponent: () => import('./admin-layout.component').then(m => m.AdminLayoutComponent),
        canActivate:[authGuard],
        children: [
            {
                path: 'home',
                loadComponent: () => import('../Shared/admin-home/admin-home.component').then(m => m.AdminHomeComponent),
                canActivate:[authGuard]
            },
            {
                path: 'all-pages-design',
                loadComponent: () => import('./all-pages-design/all-pages-design.component').then(m => m.AllPagesDesignComponent),
                canActivate:[authGuard]
            },
            {
                path: 'categories',
                loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent),
                canActivate:[authGuard]
            },
            {
                path: 'items',
                loadComponent: () => import('./items/items.component').then(m => m.ItemsComponent),
                canActivate:[authGuard]
            },
            {
                path: 'order-list',
                loadComponent: () => import('./order-list/order-list.component').then(m => m.OrderListComponent),
                canActivate:[authGuard]
            },
            {
                path: 'create-user',
                loadComponent: () => import('./admin-user/admin-user.component').then(m => m.AdminUserComponent),
                canActivate:[authGuard]
            },
            {
                path: 'order-table',
                loadComponent: () => import('./order-table/order-table.component').then(m => m.OrderTableComponent),
                canActivate:[authGuard]
            },
            { path: '', redirectTo: 'home', pathMatch: 'full' },
        ]
    },
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
