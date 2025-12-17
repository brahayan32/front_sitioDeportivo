import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdministradorService, AdministradorResponse, AdministradorRequest } from '../../../core/administrador.service';

@Component({
  selector: 'app-administradores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.scss']
})
export class AdministradoresComponent implements OnInit {
  private adminService = inject(AdministradorService);

  administradores: AdministradorResponse[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  showModal = false;
  isEditMode = false;
  showPassword = false;
  currentId: number | null = null;
  searchTerm = '';

  form: AdministradorRequest = {
    nombre: '',
    apellido: '',
    usuario: '',
    rol: 'ADMIN',
    password: ''
  };

  ngOnInit(): void {
    this.cargarAdministradores();
  }

  cargarAdministradores(): void {
    this.loading = true;
    this.error = null;
    this.success = null;

    this.adminService.findAll().subscribe({
      next: (data: AdministradorResponse[]) => {
        this.administradores = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar administradores. Intenta nuevamente.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get filteredAdministradores(): AdministradorResponse[] {
    if (!this.searchTerm.trim()) {
      return this.administradores;
    }
    const term = this.searchTerm.toLowerCase();
    return this.administradores.filter(a =>
      a.nombre.toLowerCase().includes(term) ||
      a.apellido.toLowerCase().includes(term) ||
      a.usuario.toLowerCase().includes(term)
    );
  }

  abrirModalNuevo(): void {
    this.isEditMode = false;
    this.currentId = null;
    this.resetForm();
    this.showModal = true;
  }

  abrirModalEditar(admin: AdministradorResponse): void {
    this.isEditMode = true;
    this.currentId = admin.idAdministrador;
    this.form = {
      nombre: admin.nombre,
      apellido: admin.apellido,
      usuario: admin.usuario,
      rol: admin.rol,
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

    const dto: AdministradorRequest = {
      nombre: this.form.nombre.trim(),
      apellido: this.form.apellido.trim(),
      usuario: this.form.usuario.trim(),
      rol: this.form.rol,
      password: this.form.password
    };

    if (this.isEditMode && this.currentId) {
      if (!dto.password || dto.password.trim() === '') {
        delete dto.password;
      }

      this.adminService.update(this.currentId, dto).subscribe({
        next: () => {
          this.success = 'Administrador actualizado correctamente';
          setTimeout(() => this.cargarAdministradores(), 500);
          this.cerrarModal();
        },
        error: (err: any) => {
          this.error = 'Error al actualizar. Verifica que el usuario no esté duplicado.';
          this.loading = false;
        }
      });
    } else {
      this.adminService.save(dto).subscribe({
        next: () => {
          this.success = 'Administrador creado correctamente';
          setTimeout(() => this.cargarAdministradores(), 500);
          this.cerrarModal();
        },
        error: (err: any) => {
          this.error = 'Error al crear administrador. Verifica los datos.';
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
    this.adminService.delete(id).subscribe({
      next: () => {
        this.success = 'Administrador eliminado correctamente';
        this.administradores = this.administradores.filter(a => a.idAdministrador !== id);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'No se pudo eliminar el administrador.';
        this.loading = false;
      }
    });
  }

  validarForm(): boolean {
    this.error = null;

    if (
      !this.form.nombre?.trim() ||
      !this.form.apellido?.trim() ||
      !this.form.usuario?.trim()
    ) {
      this.error = 'Nombre, apellido y usuario son obligatorios';
      return false;
    }

    const usuarioRegex = /^[a-zA-Z0-9_]{4,20}$/;
    if (!usuarioRegex.test(this.form.usuario)) {
      this.error = 'Usuario debe tener 4-20 caracteres y solo contener letras, números y guiones bajos';
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
      usuario: '',
      rol: 'ADMIN',
      password: ''
    };
    this.error = null;
    this.showPassword = false;
  }
}