import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-wrapper">
        <div class="login-card">
          <!-- Logo/Header -->
          <div class="login-header">
            <h1>🏟️ CITIO DEPORTIVO</h1>
            <p class="subtitle">Sistema de Gestión</p>
          </div>

          <!-- Formulario -->
          <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
            <!-- Campo Usuario -->
            <div class="form-group">
              <label for="identifier">Usuario o Email</label>
              <input
                id="identifier"
                type="text"
                class="form-control"
                placeholder="ej: usuario@email.com"
                formControlName="identifier"
                [class.is-invalid]="isFieldInvalid('identifier')"
                autocomplete="username"
              />
              <div *ngIf="isFieldInvalid('identifier')" class="error-message">
                El usuario o email es requerido
              </div>
            </div>

            <!-- Campo Contraseña -->
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input
                id="password"
                type="password"
                class="form-control"
                placeholder="Ingresa tu contraseña"
                formControlName="password"
                [class.is-invalid]="isFieldInvalid('password')"
                autocomplete="current-password"
                (keyup.enter)="submit()"
              />
              <div *ngIf="isFieldInvalid('password')" class="error-message">
                La contraseña es requerida
              </div>
            </div>

            <!-- Mensaje de error general -->
            <div *ngIf="error" class="alert alert-error" role="alert">
              <span class="alert-icon">⚠️</span>
              <span>{{ error }}</span>
            </div>

            <!-- Botones -->
            <div class="button-group">
              <button
                type="submit"
                class="btn btn-primary btn-block"
                [disabled]="loading || form.invalid"
              >
                <span *ngIf="!loading">Iniciar Sesión</span>
                <span *ngIf="loading" class="loading-spinner">
                  Verificando...
                </span>
              </button>

              <button
                type="button"
                class="btn btn-secondary btn-block"
                (click)="goToRegister()"
                [disabled]="loading"
              >
                Registrarse
              </button>
            </div>
          </form>

          <!-- Footer con roles de demostración -->
          <div class="demo-credentials">
            <p class="demo-title">Demo Credentials:</p>
            <div class="demo-list">
              <div class="demo-item">
                <strong>Admin:</strong> admin@citio.com / admin123
              </div>
              <div class="demo-item">
                <strong>Cliente:</strong> cliente@citio.com / cliente123
              </div>
              <div class="demo-item">
                <strong>Entrenador:</strong> entrenador@citio.com / entrenador123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .login-wrapper {
      width: 100%;
      max-width: 420px;
      padding: 16px;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }

    .login-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }

    .login-header h1 {
      font-size: 28px;
      margin-bottom: 8px;
      font-weight: 700;
    }

    .subtitle {
      font-size: 14px;
      opacity: 0.9;
      margin: 0;
    }

    .login-form {
      padding: 32px 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
      font-size: 14px;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      transition: all 0.3s ease;
      background: #f9f9f9;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control.is-invalid {
      border-color: #e53935;
      background: #ffebee;
    }

    .form-control.is-invalid:focus {
      box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
    }

    .error-message {
      color: #e53935;
      font-size: 12px;
      margin-top: 4px;
      font-weight: 500;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
    }

    .alert-error {
      background: #ffebee;
      border: 1px solid #e53935;
      color: #c62828;
    }

    .alert-icon {
      font-size: 18px;
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn {
      padding: 12px 16px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #f5f7ff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
    }

    .btn-primary:active:not(:disabled),
    .btn-secondary:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-block {
      width: 100%;
    }

    .loading-spinner {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .loading-spinner::after {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .demo-credentials {
      background: #f5f5f5;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }

    .demo-title {
      font-size: 12px;
      font-weight: 700;
      color: #666;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .demo-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .demo-item {
      font-size: 12px;
      color: #777;
      line-height: 1.4;
    }

    .demo-item strong {
      color: #333;
    }

    @media (max-width: 480px) {
      .login-wrapper {
        padding: 8px;
      }

      .login-card {
        border-radius: 8px;
      }

      .login-header {
        padding: 24px 16px;
      }

      .login-header h1 {
        font-size: 24px;
      }

      .login-form {
        padding: 24px 16px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;
  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    // Si ya está logueado, redirigir
    if (this.authService.isLoggedIn()) {
      this.redirectByRole();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      identifier: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  submit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.loading = true;
    this.error = null;

    const { identifier, password } = this.form.value;

    console.log('Intentando login con:', { usuario: identifier, password: '***' });

    this.authService.login(identifier, password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.loading = false;
        this.redirectByRole();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error completo:', err);
        this.error = err?.error?.message || err?.message || 'Credenciales inválidas. Intenta de nuevo.';
        this.form.get('password')?.reset();
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/registro']);
  }

  private redirectByRole(): void {
    const rol = this.authService.getRole();
    console.log('Redirigiendo con rol:', rol);
    switch (rol) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'ENTRENADOR':
        this.router.navigate(['/entrenador']);
        break;
      case 'CLIENTE':
        this.router.navigate(['/cliente']);
        break;
      default:
        console.warn('Rol desconocido:', rol);
        this.router.navigate(['/auth/login']);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}