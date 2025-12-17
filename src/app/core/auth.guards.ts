import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.hasValidToken()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (this.authService.hasRole('ADMIN')) {
      return true;
    }

    this.redirectToUserDashboard();
    return false;
  }

  private redirectToUserDashboard(): void {
    const role = this.authService.getRole();
    const routes: { [key: string]: string } = {
      'CLIENTE': '/cliente/reservas',
      'ENTRENADOR': '/entrenador/disponibilidades'
    };
    this.router.navigate([routes[role || ''] || '/auth/login']);
  }
}

@Injectable({ providedIn: 'root' })
export class ClienteGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.hasValidToken()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (this.authService.hasRole('CLIENTE')) {
      return true;
    }

    this.redirectToUserDashboard();
    return false;
  }

  private redirectToUserDashboard(): void {
    const role = this.authService.getRole();
    const routes: { [key: string]: string } = {
      'ADMIN': '/admin/administradores',
      'ENTRENADOR': '/entrenador/disponibilidades'
    };
    this.router.navigate([routes[role || ''] || '/auth/login']);
  }
}

@Injectable({ providedIn: 'root' })
export class EntrenadorGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.hasValidToken()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (
  this.authService.hasRole('ENTRENADOR') &&
  this.authService.getIdEntrenador() !== null
) {
  return true;
}


    this.redirectToUserDashboard();
    return false;
  }

  private redirectToUserDashboard(): void {
    const role = this.authService.getRole();
    const routes: { [key: string]: string } = {
      'ADMIN': '/admin/administradores',
      'CLIENTE': '/cliente/reservas'
    };
    this.router.navigate([routes[role || ''] || '/auth/login']);
  }
}

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.hasValidToken()) {
      return true;
    }

    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (!this.authService.hasValidToken()) {
      return true;
    }

    const role = this.authService.getRole();
    const routes: { [key: string]: string } = {
      'ADMIN': '/admin/administradores',
      'CLIENTE': '/cliente/reservas',
      'ENTRENADOR': '/entrenador/disponibilidades'
    };
    
    this.router.navigate([routes[role || ''] || '/auth/login']);
    return false;
  }
}