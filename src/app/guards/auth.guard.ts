/**

 * Guard de ruta que protege las páginas que requieren autenticación.
 */
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Guard funcional de autenticación.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // ✅ Usuario autenticado, permitir acceso
  }

  // ❌ No autenticado, redirigir al login
  router.navigate(['/login']);
  return false;
};
