import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Ruta de tabs: protegida, requiere autenticación
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.routes').then((m) => m.tabsRoutes),
    // loadChildren carga las rutas hijas definidas en tabs.routes.ts
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/carrito/carrito.page').then((m) => m.CarritoPage),
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./pages/productos/productos.page').then((m) => m.ProductosPage),
  },
  {
    path: 'detalle-producto/:id',
    loadComponent: () =>
      import('./pages/detalle-producto/detalle-producto.page').then(
        (m) => m.DetalleProductoPage,
      ),
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    // Ruta por defecto: redirige al login
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full',
  },
  {
    // Cualquier ruta no definida: redirige al login
    path: '**',
    redirectTo: 'productos',
  },
];
