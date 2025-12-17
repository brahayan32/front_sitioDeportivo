import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService, ClienteResponse, ClienteRequest } from '../../../core/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  private clienteService: ClienteService = inject(ClienteService);

  clientes: ClienteResponse[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  showModal = false;
  isEditMode = false;
  showPassword = false;
  currentId: number | null = null;
  searchTerm = '';

  form: ClienteRequest = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: ''
  };

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.error = null;
    this.success = null;

    this.clienteService.findAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar clientes. Intenta nuevamente.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get filteredClientes(): ClienteResponse[] {
    if (!this.searchTerm.trim()) {
      return this.clientes;
    }
    const term = this.searchTerm.toLowerCase();
    return this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(term) ||
      c.apellido.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );
  }

  abrirModalNuevo(): void {
    this.isEditMode = false;
    this.currentId = null;
    this.resetForm();
    this.showModal = true;
  }

  abrirModalEditar(cliente: ClienteResponse): void {
    this.isEditMode = true;
    this.currentId = cliente.idCliente;
    this.form = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono || '',
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

    const dto: ClienteRequest = {
      nombre: this.form.nombre.trim(),
      apellido: this.form.apellido.trim(),
      email: this.form.email.trim(),
      telefono: this.form.telefono?.trim() || undefined,
      password: this.form.password
    };

    if (this.isEditMode && this.currentId) {
      if (!dto.password || dto.password.trim() === '') {
        delete dto.password;
      }

      this.clienteService.update(this.currentId, dto).subscribe({
        next: () => {
          this.success = 'Cliente actualizado correctamente';
          setTimeout(() => this.cargarClientes(), 500);
          this.cerrarModal();
        },
        error: (err) => {
          this.error = 'Error al actualizar. Verifica que el email no esté duplicado.';
          this.loading = false;
        }
      });
    } else {
      this.clienteService.save(dto).subscribe({
        next: () => {
          this.success = 'Cliente creado correctamente';
          setTimeout(() => this.cargarClientes(), 500);
          this.cerrarModal();
        },
        error: (err) => {
          this.error = 'Error al crear cliente. Verifica los datos.';
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
    this.clienteService.delete(id).subscribe({
      next: () => {
        this.success = 'Cliente eliminado correctamente';
        this.clientes = this.clientes.filter(c => c.idCliente !== id);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo eliminar el cliente.';
        this.loading = false;
      }
    });
  }

  validarForm(): boolean {
    this.error = null;
    
    if (!this.form.nombre?.trim() || !this.form.apellido?.trim() || !this.form.email?.trim()) {
      this.error = 'Nombre, apellido y email son obligatorios';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.form.email)) {
      this.error = 'Formato de email inválido';
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
      email: '',
      telefono: '',
      password: ''
    };
    this.error = null;
    this.showPassword = false;
  }
}