import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  identifier: string;  // CAMPO CORRECTO: identifier (no usuario)
  password: string;
}

export interface LoginResponse {
  token: string;
  idUsuario: number;
  nombre: string;
  rol: string;
  idCliente?: number;
  idEntrenador?: number;
}

export interface RegistroRequest {
  nombre: string;
  usuario?: string;  // Solo para ADMIN
  email: string;
  password: string;
  rol: string;
  telefono: string;
  documento: string;
}

export interface RegistroResponse {
  message: string;
  success: boolean;
  usuario?: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private apiUrl = `${environment.apiUrl}/auth`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  /**
   * Verificar si está en el navegador
   */
  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Hacer login - ACEPTA DOS PARÁMETROS
   * POST /auth/login
   * Backend espera: { identifier, password }
   */
  login(identifier: string, password: string): Observable<LoginResponse> {
    const credentials: LoginRequest = { 
      identifier,  // CORRECTO: usar "identifier"
      password 
    };
    
    console.log('Enviando al backend:', credentials);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        console.log('Respuesta del backend:', response);
        
        if (this.isBrowser) {
          // Guardar token
          localStorage.setItem('authToken', response.token);
          
          // Guardar datos del usuario
          localStorage.setItem('userId', response.idUsuario.toString());
          localStorage.setItem('userName', response.nombre);
          localStorage.setItem('userRole', response.rol);
          
          // Si es entrenador, guardar su ID
          if (response.rol === 'ENTRENADOR' && response.idEntrenador) {
            localStorage.setItem('idEntrenador', response.idEntrenador.toString());
          }
          
          // Si es cliente, guardar su ID
          if (response.rol === 'CLIENTE' && response.idCliente) {
            localStorage.setItem('idCliente', response.idCliente.toString());
          }
        }
        
        // Actualizar estado
        this.isLoggedInSubject.next(true);
      })
    );
  }

  /**
   * Registrar nueva cuenta
   * POST /auth/registro
   */
  registro(datos: RegistroRequest): Observable<RegistroResponse> {
    return this.http.post<RegistroResponse>(`${this.apiUrl}/registro`, datos);
  }

  /**
   * Verificar si usuario está disponible
   * GET /auth/usuario/{usuario}/disponible
   */
  verificarUsuarioDisponible(usuario: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/usuario/${usuario}/disponible`);
  }

  /**
   * Verificar si email está disponible
   * GET /auth/email/{email}/disponible
   */
  verificarEmailDisponible(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/email/${email}/disponible`);
  }

  /**
   * Hacer logout
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('idEntrenador');
      localStorage.removeItem('idCliente');
    }
    
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * MÉTODO PÚBLICO: Verificar si está logueado
   */
  isLoggedIn(): boolean {
    return this.hasToken();
  }

  /**
   * Verificar si está autenticado
   */
  isAutenticado(): boolean {
    return this.hasToken();
  }

  /**
   * Verificar si tiene un token válido (requerido por guards)
   */
  hasValidToken(): boolean {
    return this.hasToken();
  }

  /**
   * Verificar si tiene un rol específico (requerido por guards)
   */
  hasRole(rol: string): boolean {
  if (!this.hasValidToken()) return false;
  return this.getUserRole().toUpperCase() === rol.toUpperCase();
}


  /**
   * Obtener el rol del usuario (requerido por guards)
   */
  getRole(): string {
    return this.getUserRole();
  }

  /**
   * Obtener el nombre del usuario (requerido por layouts)
   */
  getNombre(): string {
    return this.getUserName();
  }

  /**
   * Obtener el rol del usuario
   */
  getUserRole(): string {
    if (!this.isBrowser) return '';
    return localStorage.getItem('userRole') || '';
  }

  /**
   * Obtener el nombre del usuario
   */
  getUserName(): string {
    if (!this.isBrowser) return '';
    return localStorage.getItem('userName') || '';
  }

  /**
   * Obtener el ID del usuario
   */
  getUserId(): number {
    if (!this.isBrowser) return 0;
    return parseInt(localStorage.getItem('userId') || '0', 10);
  }

  /**
   * Obtener el ID del entrenador (si aplica)
   */
  getIdEntrenador(): number | null {
    if (!this.isBrowser) return null;
    const id = localStorage.getItem('idEntrenador');
    return id ? parseInt(id, 10) : null;
  }

  /**
   * Obtener el ID del cliente (si aplica)
   */
  getIdCliente(): number | null {
    if (!this.isBrowser) return null;
    const id = localStorage.getItem('idCliente');
    return id ? parseInt(id, 10) : null;
  }

  /**
   * Obtener el token
   */
  getToken(): string {
    if (!this.isBrowser) return '';
    return localStorage.getItem('authToken') || '';
  }

  /**
   * Validar si existe token
   */
  private hasToken(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('authToken');
  }

  /**
   * Actualizar perfil de usuario (Opcional)
   * PUT /auth/perfil
   */
  actualizarPerfil(datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, datos);
  }

  /**
   * Cambiar contraseña (Opcional)
   * PUT /auth/cambiar-password
   */
  cambiarPassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/cambiar-password`, {
      oldPassword,
      newPassword
    });
  }

  /**
   * Recuperar contraseña (Opcional)
   * POST /auth/recuperar-password
   */
  recuperarPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar-password`, { email });
  }
}