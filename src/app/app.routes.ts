import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    // Ruta de tabs: protegida, requiere autenticación
    path: 'tabs',
    canActivate: [authGuard], // Verifica la sesión antes de dar acceso
    loadChildren: () =>
      import('./pages/tabs/tabs.routes').then((m) => m.tabsRoutes),
    // loadChildren carga las rutas hijas definidas en tabs.routes.ts
  },
  {
    path: 'detalle-producto/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/detalle-producto/detalle-producto.page').then(
        (m) => m.DetalleProductoPage,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    // Ruta por defecto: redirige al login
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    // Cualquier ruta no definida: redirige al login
    path: '**',
    redirectTo: 'login',
  },
];
