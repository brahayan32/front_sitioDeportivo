import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SolicitudEntrenamientoService, SolicitudEntrenamientoRequestDTO, SolicitudEntrenamientoResponseDTO } from '../../../core/solicitud-entrenamiento.service';

interface SolicitudForm {
  idSolicitud?: number;
  idCliente: number | null;
  idEntrenador: number | null;
  inicio: string;
  fin: string;
  estado: string;
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private solicitudService = inject(SolicitudEntrenamientoService);

  solicitudes: SolicitudEntrenamientoResponseDTO[] = [];
  loading = false;
  error: string | null = null;
  showModal = false;
  isEditMode = false;

  // Formulario
  form: SolicitudForm = {
    idCliente: null,
    idEntrenador: null,
    inicio: '',
    fin: '',
    estado: 'PENDIENTE'
  };

  // Estados disponibles
  estados: string[] = ['PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'COMPLETADA', 'CANCELADA'];

  ngOnInit(): void {
    this.loadSolicitudes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSolicitudes(): void {
    this.loading = true;
    this.error = null;

    this.solicitudService.listar().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las solicitudes';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  abrirModalNuevo(): void {
    this.isEditMode = false;
    this.form = {
      idCliente: null,
      idEntrenador: null,
      inicio: '',
      fin: '',
      estado: 'PENDIENTE'
    };
    this.showModal = true;
  }

  abrirModalEditar(solicitud: SolicitudEntrenamientoResponseDTO): void {
    this.isEditMode = true;
    this.form = {
      idSolicitud: solicitud.idSolicitud,
      idCliente: solicitud.idCliente,
      idEntrenador: solicitud.idEntrenador || null,
      inicio: this.formatDateTimeLocal(solicitud.inicio),
      fin: this.formatDateTimeLocal(solicitud.fin),
      estado: solicitud.estado
    };
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.form = {
      idCliente: null,
      idEntrenador: null,
      inicio: '',
      fin: '',
      estado: 'PENDIENTE'
    };
  }

  guardar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    this.error = null;

    const payload: SolicitudEntrenamientoRequestDTO = {
      idCliente: this.form.idCliente!,
      idEntrenador: this.form.idEntrenador,
      inicio: this.parseDateTime(this.form.inicio),
      fin: this.parseDateTime(this.form.fin),
      estado: this.form.estado
    };

    const request = this.isEditMode
      ? this.solicitudService.actualizar(this.form.idSolicitud!, payload)
      : this.solicitudService.crear(payload);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loadSolicitudes();
        this.cerrarModal();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al guardar la solicitud';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta solicitud?')) {
      return;
    }

    this.loading = true;
    this.solicitudService.eliminar(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.loadSolicitudes();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar la solicitud';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  getEstadoBadgeClass(estado: string): string {
    const classes: { [key: string]: string } = {
      'PENDIENTE': 'badge-warning',
      'ACEPTADA': 'badge-success',
      'RECHAZADA': 'badge-danger',
      'COMPLETADA': 'badge-info',
      'CANCELADA': 'badge-secondary'
    };
    return classes[estado] || 'badge-secondary';
  }

  private validarFormulario(): boolean {
    if (!this.form.idCliente || !this.form.inicio || !this.form.fin || !this.form.estado) {
      this.error = 'Por favor completa todos los campos obligatorios';
      return false;
    }

    const inicio = new Date(this.form.inicio);
    const fin = new Date(this.form.fin);

    if (inicio >= fin) {
      this.error = 'La fecha de fin debe ser posterior a la fecha de inicio';
      return false;
    }

    return true;
  }

  private formatDateTimeLocal(dateTime: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private parseDateTime(dateTimeLocal: string): string {
    // Convierte de formato "2025-12-15T10:30" a ISO "2025-12-15T10:30:00"
    return dateTimeLocal + ':00';
  }
}