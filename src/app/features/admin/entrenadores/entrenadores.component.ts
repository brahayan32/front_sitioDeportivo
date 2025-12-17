import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntrenadorService, EntrenadorResponse, EntrenadorRequest } from '../../../core/entrenador.service';

@Component({
  selector: 'app-entrenadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrenadores.component.html',
  styleUrls: ['./entrenadores.component.scss']
})
export class EntrenadoresComponent implements OnInit {
  private entrenadorService = inject(EntrenadorService);

  entrenadores: EntrenadorResponse[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  showModal = false;
  isEditMode = false;
  showPassword = false;
  currentId: number | null = null;
  searchTerm = '';

  form: EntrenadorRequest = {
    nombre: '',
    apellido: '',
    especialidad: '',
    email: '',
    telefono: '',
    password: ''
  };

  especialidades = [
    'Fútbol',
    'padel'
  ];

  ngOnInit(): void {
    this.cargarEntrenadores();
  }

  cargarEntrenadores(): void {
    this.loading = true;
    this.error = null;
    this.success = null;

    this.entrenadorService.findAll().subscribe({
      next: (data) => {
        this.entrenadores = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar entrenadores. Intenta nuevamente.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get filteredEntrenadores(): EntrenadorResponse[] {
    if (!this.searchTerm.trim()) {
      return this.entrenadores;
    }
    const term = this.searchTerm.toLowerCase();
    return this.entrenadores.filter(e =>
      e.nombre.toLowerCase().includes(term) ||
      e.apellido.toLowerCase().includes(term) ||
      e.especialidad.toLowerCase().includes(term) ||
      e.email.toLowerCase().includes(term)
    );
  }

  abrirModalNuevo(): void {
    this.isEditMode = false;
    this.currentId = null;
    this.resetForm();
    this.showModal = true;
  }

  abrirModalEditar(entrenador: EntrenadorResponse): void {
    this.isEditMode = true;
    this.currentId = entrenador.idEntrenador;
    this.form = {
      nombre: entrenador.nombre,
      apellido: entrenador.apellido,
      especialidad: entrenador.especialidad,
      email: entrenador.email,
      telefono: entrenador.telefono,
      password: ''
    };
    this.showPassword = false;
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.resetForm();
    this.error = null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  guardar(): void {
    if (!this.validarForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    const dto: EntrenadorRequest = {
      nombre: this.form.nombre.trim(),
      apellido: this.form.apellido.trim(),
      especialidad: this.form.especialidad.trim(),
      email: this.form.email.trim(),
      telefono: this.form.telefono.trim(),
      password: this.form.password
    };

    if (this.isEditMode && this.currentId) {
      if (!dto.password || dto.password.trim() === '') {
        delete dto.password;
      }

      this.entrenadorService.update(this.currentId, dto).subscribe({
        next: () => {
          this.success = 'Entrenador actualizado correctamente';
          setTimeout(() => this.cargarEntrenadores(), 500);
          this.cerrarModal();
        },
        error: (err) => {
          this.error = 'Error al actualizar. Verifica que el email no esté duplicado.';
          this.loading = false;
        }
      });
    } else {
      this.entrenadorService.save(dto).subscribe({
        next: () => {
          this.success = 'Entrenador creado correctamente';
          setTimeout(() => this.cargarEntrenadores(), 500);
          this.cerrarModal();
        },
        error: (err) => {
          this.error = 'Error al crear entrenador. Verifica los datos.';
          this.loading = false;
        }
      });
    }
  }

  eliminar(id: number, nombre: string): void {
    if (!confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) {
      return;
    }

    this.loading = true;
    this.entrenadorService.delete(id).subscribe({
      next: () => {
        this.success = 'Entrenador eliminado correctamente';
        this.entrenadores = this.entrenadores.filter(e => e.idEntrenador !== id);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo eliminar el entrenador.';
        this.loading = false;
      }
    });
  }

  validarForm(): boolean {
    this.error = null;

    if (
      !this.form.nombre?.trim() ||
      !this.form.apellido?.trim() ||
      !this.form.email?.trim() ||
      !this.form.especialidad?.trim() ||
      !this.form.telefono?.trim()
    ) {
      this.error = 'Todos los campos marcados con * son obligatorios';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.form.email)) {
      this.error = 'Formato de email inválido';
      return false;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(this.form.telefono)) {
      this.error = 'Formato de teléfono inválido';
      return false;
    }

    if (!this.isEditMode) {
      if (!this.form.password || this.form.password.length < 6) {
        this.error = 'La contraseña es obligatoria y debe tener al menos 6 caracteres';
        return false;
      }
    }

    if (this.isEditMode && this.form.password && this.form.password.length > 0) {
      if (this.form.password.length < 6) {
        this.error = 'La nueva contraseña debe tener al menos 6 caracteres';
        return false;
      }
    }

    return true;
  }

  resetForm(): void {
    this.form = {
      nombre: '',
      apellido: '',
      especialidad: '',
      email: '',
      telefono: '',
      password: ''
    };
    this.error = null;
    this.showPassword = false;
  }
}