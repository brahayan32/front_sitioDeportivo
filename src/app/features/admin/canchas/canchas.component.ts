import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CanchaService,
  CanchaResponse,
  CanchaRequest,
  TipoCancha,
  EstadoCancha
} from '../../../core/cancha.service';
import { TarifaService, TarifaResponse } from '../../../core/tarifa.service';

@Component({
  selector: 'app-canchas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './canchas.component.html',
  styleUrls: ['./canchas.component.scss']
})
export class CanchasComponent implements OnInit {
  private canchaService = inject(CanchaService);
  private tarifaService = inject(TarifaService);

  tarifas: TarifaResponse[] = [];

  canchas: CanchaResponse[] = [];
  loading = false;
  error: string | null = null;

  showModal = false;
  isEditMode = false;
  currentId: number | null = null;

  readonly TIPOS: TipoCancha[] = ['FUTBOL_6', 'PADEL'];
  readonly ESTADOS: EstadoCancha[] = ['DISPONIBLE', 'MANTENIMIENTO', 'INACTIVA'];

  form: CanchaRequest = this.formVacio();

  ngOnInit(): void {
    this.cargarCanchas();
    this.cargarTarifas();
  }

  cargarTarifas(): void {
  this.tarifaService.findVigentes().subscribe({
    next: (data: TarifaResponse[]) => {
      this.tarifas = data;
    }
  });
}


  cargarCanchas(): void {
    this.loading = true;
    this.canchaService.findAll().subscribe({
      next: data => {
        this.canchas = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar las canchas';
        this.loading = false;
      }
    });
  }

  abrirModalNuevo(): void {
    if (this.totalCanchas >= 4) {
      this.error = 'Ya existen las 4 canchas del centro deportivo';
      return;
    }
    this.isEditMode = false;
    this.currentId = null;
    this.form = this.formVacio();
    this.showModal = true;
  }

  abrirModalEditar(cancha: CanchaResponse): void {
    this.isEditMode = true;
    this.currentId = cancha.idCancha;
    this.form = { ...cancha };
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.error = null;
  }

  guardar(): void {
    if (!this.validarFormulario()) return;

    this.loading = true;

    const accion = this.isEditMode && this.currentId
      ? this.canchaService.update(this.currentId, this.form)
      : this.canchaService.save(this.form);

    accion.subscribe({
      next: () => {
        this.cargarCanchas();
        this.cerrarModal();
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.message || 'Error al guardar la cancha';
        this.loading = false;
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta cancha?')) return;

    this.loading = true;
    this.canchaService.delete(id).subscribe({
      next: () => {
        this.cargarCanchas();
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo eliminar la cancha';
        this.loading = false;
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.form.nombre || !this.form.tipo || !this.form.estado) {
      this.error = 'Todos los campos obligatorios deben completarse';
      return false;
    }

    if (!this.isEditMode && this.cantidadPorTipo(this.form.tipo) >= 2) {
      this.error = `Ya existen 2 canchas del tipo ${this.form.tipo}`;
      return false;
    }

    return true;
  }

  cantidadPorTipo(tipo: TipoCancha): number {
    return this.canchas.filter(c => c.tipo === tipo).length;
  }

  get totalCanchas(): number {
    return this.canchas.length;
  }

  getEstadoBadgeClass(estado: EstadoCancha): string {
    return {
      DISPONIBLE: 'badge-disponible',
      MANTENIMIENTO: 'badge-mantenimiento',
      INACTIVA: 'badge-inactiva'
    }[estado];
  }

  private formVacio(): CanchaRequest {
    return {
      nombre: '',
      tipo: 'FUTBOL_6',
      estado: 'DISPONIBLE',
      descripcion: ''
    };
  }
}
