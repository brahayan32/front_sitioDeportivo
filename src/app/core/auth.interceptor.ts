import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Interceptor HTTP funcional que:
 * 1. Añade el token JWT a todas las peticiones
 * 2. Maneja errores de autenticación (401)
 * 3. Redirige al login si el token ha expirado
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener token
  const token = authService.getToken();

  // Clonar la petición y añadir el token si existe
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Manejar la respuesta y errores
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si recibimos 401 (No autorizado) o 403 (Prohibido)
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};