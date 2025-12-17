import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="registro-container">
      <div class="registro-wrapper">
        <div class="registro-card">
          <!-- Header -->
          <div class="registro-header">
            <h1>🏟️ CITIO DEPORTIVO</h1>
            <p class="subtitle">Crear Cuenta de Cliente</p>
          </div>

          <!-- Formulario -->
          <form [formGroup]="form" (ngSubmit)="submit()" class="registro-form">
            
            <!-- Nombre Completo -->
            <div class="form-group">
              <label for="nombre">Nombre Completo *</label>
              <input
                id="nombre"
                type="text"
                class="form-control"
                placeholder="Juan Pérez"
                formControlName="nombre"
                [class.is-invalid]="isFieldInvalid('nombre')"
              />
              <div *ngIf="isFieldInvalid('nombre')" class="error-message">
                El nombre es requerido
              </div>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">Email *</label>
              <input
                id="email"
                type="email"
                class="form-control"
                placeholder="tu@email.com"
                formControlName="email"
                [class.is-invalid]="isFieldInvalid('email')"
              />
              <div *ngIf="isFieldInvalid('email')" class="error-message">
                <span *ngIf="form.get('email')?.errors?.['required']">El email es requerido</span>
                <span *ngIf="form.get('email')?.errors?.['email']">Email inválido</span>
              </div>
            </div>

            <!-- Teléfono -->
            <div class="form-group">
              <label for="telefono">Teléfono *</label>
              <input
                id="telefono"
                type="tel"
                class="form-control"
                placeholder="+57 300 123 4567"
                formControlName="telefono"
                [class.is-invalid]="isFieldInvalid('telefono')"
              />
              <div *ngIf="isFieldInvalid('telefono')" class="error-message">
                El teléfono es requerido
              </div>
            </div>

            <!-- Documento -->
            <div class="form-group">
              <label for="documento">Documento de Identidad *</label>
              <input
                id="documento"
                type="text"
                class="form-control"
                placeholder="12345678"
                formControlName="documento"
                [class.is-invalid]="isFieldInvalid('documento')"
              />
              <div *ngIf="isFieldInvalid('documento')" class="error-message">
                El documento es requerido
              </div>
            </div>

            <!-- Contraseña -->
            <div class="form-group">
              <label for="password">Contraseña *</label>
              <input
                id="password"
                type="password"
                class="form-control"
                placeholder="Mínimo 6 caracteres"
                formControlName="password"
                [class.is-invalid]="isFieldInvalid('password')"
              />
              <div *ngIf="isFieldInvalid('password')" class="error-message">
                La contraseña debe tener al menos 6 caracteres
              </div>
            </div>

            <!-- Confirmar Contraseña -->
            <div class="form-group">
              <label for="confirmPassword">Confirmar Contraseña *</label>
              <input
                id="confirmPassword"
                type="password"
                class="form-control"
                placeholder="Repite tu contraseña"
                formControlName="confirmPassword"
                [class.is-invalid]="isFieldInvalid('confirmPassword')"
              />
              <div *ngIf="isFieldInvalid('confirmPassword')" class="error-message">
                <span *ngIf="form.get('confirmPassword')?.errors?.['required']">
                  Debes confirmar tu contraseña
                </span>
                <span *ngIf="form.errors?.['passwordMismatch']">
                  Las contraseñas no coinciden
                </span>
              </div>
            </div>

            <!-- Info sobre entrenadores -->
            <div class="info-box">
              <div class="info-icon">ℹ️</div>
              <div class="info-text">
                <strong>¿Quieres ser entrenador?</strong>
                <p>Los entrenadores son registrados únicamente por el administrador del sistema.</p>
              </div>
            </div>

            <!-- Mensajes -->
            <div *ngIf="successMessage" class="alert alert-success">
              <span class="alert-icon">✅</span>
              <span>{{ successMessage }}</span>
            </div>

            <div *ngIf="errorMessage" class="alert alert-error">
              <span class="alert-icon">⚠️</span>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Botones -->
            <div class="button-group">
              <button
                type="submit"
                class="btn btn-primary btn-block"
                [disabled]="loading || form.invalid"
              >
                <span *ngIf="!loading">Crear Cuenta</span>
                <span *ngIf="loading" class="loading-spinner">Procesando...</span>
              </button>

              <button
                type="button"
                class="btn btn-secondary btn-block"
                (click)="goToLogin()"
                [disabled]="loading"
              >
                Ya tengo cuenta - Iniciar Sesión
              </button>
            </div>
          </form>
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

    .registro-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 20px 0;
    }

    .registro-wrapper {
      width: 100%;
      max-width: 500px;
      padding: 16px;
    }

    .registro-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }

    .registro-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      text-align: center;
    }

    .registro-header h1 {
      font-size: 24px;
      margin-bottom: 8px;
      font-weight: 700;
    }

    .subtitle {
      font-size: 14px;
      opacity: 0.9;
      margin: 0;
    }

    .registro-form {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 6px;
      color: #333;
      font-size: 13px;
    }

    .form-control {
      width: 100%;
      padding: 10px 14px;
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

    .error-message {
      color: #e53935;
      font-size: 12px;
      margin-top: 4px;
      font-weight: 500;
    }

    .info-box {
      background: #e3f2fd;
      border: 1px solid #2196f3;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 16px;
      display: flex;
      gap: 12px;
    }

    .info-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    .info-text {
      flex: 1;
    }

    .info-text strong {
      display: block;
      color: #1976d2;
      font-size: 13px;
      margin-bottom: 4px;
    }

    .info-text p {
      color: #424242;
      font-size: 12px;
      margin: 0;
      line-height: 1.4;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
    }

    .alert-error {
      background: #ffebee;
      border: 1px solid #e53935;
      color: #c62828;
    }

    .alert-success {
      background: #e8f5e9;
      border: 1px solid #4caf50;
      color: #2e7d32;
    }

    .alert-icon {
      font-size: 16px;
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 20px;
    }

    .btn {
      padding: 12px 16px;
      border: none;
      border-radius: 6px;
      font-size: 15px;
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

    @media (max-width: 480px) {
      .registro-wrapper {
        padding: 8px;
      }

      .registro-card {
        border-radius: 8px;
      }

      .registro-form {
        padding: 20px 16px;
      }
    }
  `]
})
export class RegistroComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(7)]],
      documento: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
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
    this.errorMessage = null;
    this.successMessage = null;

    const { confirmPassword, ...formData } = this.form.value;

    // SIEMPRE registrar como CLIENTE
    const registroData = {
      ...formData,
      rol: 'CLIENTE'
    };

    console.log('Datos de registro:', registroData);

    this.authService.registro(registroData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.loading = false;
        this.successMessage = response.message || '¡Cuenta creada exitosamente! Redirigiendo al login...';
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en registro:', err);
        this.errorMessage = err?.error?.message || 'Error al crear la cuenta. Intenta de nuevo.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
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