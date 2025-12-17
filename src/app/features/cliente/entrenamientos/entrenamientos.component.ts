import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ← AGREGAR ESTA LÍNEA
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-entrenamientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrenamientos.component.html',
  styleUrls: ['./entrenamientos.component.scss']
})
export class EntrenamientosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  entrenamientos: any[] = [];
  loading = false;
  error: string | null = null;
  filterEstado = 'todos';

  ngOnInit(): void {
    this.loadEntrenamientos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEntrenamientos(): void {
    this.loading = true;
    this.error = null;

    // TODO: Conectar con SolicitudEntrenamientoService cuando esté disponible
    // this.entrenamientoService.getMisEntrenamientos().pipe(
    //   takeUntil(this.destroy$)
    // ).subscribe({
    //   next: (data) => {
    //     this.entrenamientos = data;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     this.error = 'Error al cargar los entrenamientos';
    //     this.loading = false;
    //   }
    // });

    // Datos de ejemplo
    setTimeout(() => {
      this.entrenamientos = [
        {
          id: 1,
          entrenador: 'Juan Pérez',
          disciplina: 'Fútbol',
          fecha: '2025-12-15',
          hora: '10:00 AM',
          duracion: '1 hora',
          estado: 'Confirmado',
          ubicacion: 'Cancha 1'
        },
        {
          id: 2,
          entrenador: 'María González',
          disciplina: 'Tenis',
          fecha: '2025-12-16',
          hora: '3:00 PM',
          duracion: '1.5 horas',
          estado: 'Pendiente',
          ubicacion: 'Cancha 3'
        }
      ];
      this.loading = false;
    }, 500);
  }

  get entrenamientosFiltrados(): any[] {
    if (this.filterEstado === 'todos') {
      return this.entrenamientos;
    }
    return this.entrenamientos.filter(e => e.estado.toLowerCase() === this.filterEstado.toLowerCase());
  }

  cancelarEntrenamiento(id: number): void {
    const confirmación = confirm('¿Estás seguro de que deseas cancelar este entrenamiento?');
    if (confirmación) {
      console.log('Cancelar entrenamiento:', id);
      // TODO: Llamar al servicio
    }
  }

  contactarEntrenador(id: number): void {
    console.log('Contactar entrenador:', id);
    // TODO: Implementar chat o contacto directo
  }
}