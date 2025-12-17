import { Routes } from '@angular/router';
import { AdminGuard, ClienteGuard, EntrenadorGuard, LoginGuard } from './core/auth.guards';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  },

  // ============ RUTAS PÚBLICAS ============
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        canActivate: [LoginGuard],
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'registro',
        canActivate: [LoginGuard],
        loadComponent: () => import('./features/auth/registro.component').then(m => m.RegistroComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // ============ RUTAS ADMIN ============
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'administradores',
        loadComponent: () => import('./features/admin/administradores/administradores.component').then(m => m.AdministradoresComponent)
      },
      {
        path: 'canchas',
        loadComponent: () => import('./features/admin/canchas/canchas.component').then(m => m.CanchasComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/admin/clientes/clientes.component').then(m => m.ClientesComponent)
      },
      {
        path: 'entrenadores',
        loadComponent: () => import('./features/admin/entrenadores/entrenadores.component').then(m => m.EntrenadoresComponent)
      },
      {
        path: 'tarifas',
        loadComponent: () => import('./features/admin/tarifas/tarifas.component').then(m => m.TarifasComponent)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./features/admin/reportes/reportes.component').then(m => m.ReportesComponent)
      },
      {
        path: '',
        redirectTo: 'administradores',
        pathMatch: 'full'
      }
    ]
  },

  // ============ RUTAS CLIENTE ============
  {
    path: 'cliente',
    canActivate: [ClienteGuard],
    loadComponent: () => import('./features/cliente/cliente-layout.component').then(m => m.ClienteLayoutComponent),
    children: [
      {
        path: 'reservas',
        loadComponent: () => import('./features/cliente/reservas/reservas.component').then(m => m.ReservasComponent)
      },
      {
        path: 'mis-pagos',
        loadComponent: () => import('./features/cliente/pagos/pagos.component').then(m => m.PagosComponent)
      },
      {
        path: 'entrenamientos',
        loadComponent: () => import('./features/cliente/entrenamientos/entrenamientos.component').then(m => m.EntrenamientosComponent)
      },
      {
        path: '',
        redirectTo: 'reservas',
        pathMatch: 'full'
      }
    ]
  },

  // ============ RUTAS ENTRENADOR ============
  {
    path: 'entrenador',
    canActivate: [EntrenadorGuard],
    loadComponent: () => import('./features/entrenador/entrenador-layout.component').then(m => m.EntrenadorLayoutComponent),
    children: [
      {
        path: 'disponibilidades',
        loadComponent: () => import('./features/entrenador/disponibilidades/disponibilidades.component').then(m => m.DisponibilidadesComponent)
      },
      {
        path: 'solicitudes',
        loadComponent: () => import('./features/entrenador/solicitudes/solicitudes.component').then(m => m.SolicitudesComponent)
      },
      {
        path: '',
        redirectTo: 'disponibilidades',
        pathMatch: 'full'
      }
    ]
  },

  // ============ CATCH ALL ============
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];