import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisponibilidadService, DisponibilidadResponse, DisponibilidadRequest } from '../../../core/disponibilidad.service';

@Component({
  selector: 'app-disponibilidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disponibilidades.component.html',
  styleUrls: ['./disponibilidades.component.scss']
})
export class DisponibilidadesComponent implements OnInit {
  private disponibilidadService = inject(DisponibilidadService);

  disponibilidades: DisponibilidadResponse[] = [];
  loading = false;
  error: string | null = null;
  
  showModal = false;
  isEditMode = false;
  currentId: number | null = null;

  form: DisponibilidadRequest = {
    idEntrenador: 0,
    diaDesSemana: '',
    horaInicio: '',
    horaFin: ''
  };

  // Obtener el ID del entrenador del localStorage (después de login)
  get idEntrenadorActual(): number {
    return parseInt(localStorage.getItem('idEntrenador') || '0', 10);
  }

  diasSemana = [
    { value: 'LUNES', label: 'Lunes' },
    { value: 'MARTES', label: 'Martes' },
    { value: 'MIERCOLES', label: 'Miércoles' },
    { value: 'JUEVES', label: 'Jueves' },
    { value: 'VIERNES', label: 'Viernes' },
    { value: 'SABADO', label: 'Sábado' },
    { value: 'DOMINGO', label: 'Domingo' }
  ];

  ngOnInit(): void {
    this.cargarDisponibilidades();
  }

  cargarDisponibilidades(): void {
    this.loading = true;
    this.error = null;

    const idEntrenador = this.idEntrenadorActual;
    
    if (!idEntrenador) {
      this.error = 'No se pudo obtener el ID del entrenador';
      this.loading = false;
      return;
    }

    this.disponibilidadService.findByEntrenador(idEntrenador).subscribe({
      next: (data: DisponibilidadResponse[]) => {
        this.disponibilidades = data;
        this.loading = false;
      },
      error: (err: any) => {
        // Si no existe el endpoint findByEntrenador, cargar todas
        this.disponibilidadService.findAll().subscribe({
          next: (data: DisponibilidadResponse[]) => {
            this.disponibilidades = data.filter(d => d.idEntrenador === idEntrenador);
            this.loading = false;
          },
          error: (err: any) => {
            this.error = 'Error al cargar disponibilidades';
            this.loading = false;
            console.error(err);
          }
        });
      }
    });
  }

  abrirModalNuevo(): void {
    this.isEditMode = false;
    this.currentId = null;
    this.resetForm();
    this.form.idEntrenador = this.idEntrenadorActual;
    this.showModal = true;
  }

  abrirModalEditar(disponibilidad: DisponibilidadResponse): void {
    this.isEditMode = true;
    this.currentId = disponibilidad.idDisponibilidad;
    this.form = {
      idEntrenador: disponibilidad.idEntrenador,
      diaDesSemana: disponibilidad.diaDesSemana,
      horaInicio: disponibilidad.horaInicio,
      horaFin: disponibilidad.horaFin
    };
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  guardar(): void {
    if (!this.validarForm()) {
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.currentId) {
      this.disponibilidadService.update(this.currentId, this.form).subscribe({
        next: () => {
          this.cargarDisponibilidades();
          this.cerrarModal();
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error al actualizar disponibilidad';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.disponibilidadService.save(this.form).subscribe({
        next: () => {
          this.cargarDisponibilidades();
          this.cerrarModal();
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error al crear disponibilidad';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta disponibilidad?')) {
      return;
    }

    this.loading = true;
    this.disponibilidadService.delete(id).subscribe({
      next: () => {
        this.cargarDisponibilidades();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al eliminar disponibilidad';
        this.loading = false;
        console.error(err);
      }
    });
  }

  validarForm(): boolean {
    if (!this.form.idEntrenador || !this.form.diaDesSemana || !this.form.horaInicio || !this.form.horaFin) {
      this.error = 'Todos los campos son obligatorios';
      return false;
    }

    if (this.form.horaInicio >= this.form.horaFin) {
      this.error = 'La hora fin debe ser posterior a la hora inicio';
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.form = {
      idEntrenador: this.idEntrenadorActual,
      diaDesSemana: '',
      horaInicio: '',
      horaFin: ''
    };
    this.error = null;
  }

  getNombreDia(dia: string): string {
    const diaObj = this.diasSemana.find(d => d.value === dia);
    return diaObj ? diaObj.label : dia;
  }
}