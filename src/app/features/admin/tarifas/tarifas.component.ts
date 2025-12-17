import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarifaService, TarifaResponse, TarifaRequest } from '../../../core/tarifa.service';

@Component({
  selector: 'app-tarifas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.scss']
})
export class TarifasComponent implements OnInit {
  private tarifaService = inject(TarifaService);

  tarifas: TarifaResponse[] = [];
  loading = false;
  error: string | null = null;
  
  showModal = false;
  isEditMode = false;
  currentId: number | null = null;

  form: TarifaRequest = {
    tipoServicio: '',
    precioHora: 0,
    vigente: true,
    idAdmin: undefined
  };

  ngOnInit(): void {
    this.cargarTarifas();
  }

  cargarTarifas(): void {
    this.loading = true;
    this.error = null;

    this.tarifaService.findAll().subscribe({
      next: (data) => {
        this.tarifas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar tarifas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  abrirModalNuevo(): void {
    this.isEditMode = false;
    this.currentId = null;
    this.resetForm();
    this.showModal = true;
  }

  abrirModalEditar(tarifa: TarifaResponse): void {
    this.isEditMode = true;
    this.currentId = tarifa.idTarifa;
    this.form = {
      tipoServicio: tarifa.tipoServicio,
      precioHora: tarifa.precioHora,
      vigente: tarifa.vigente,
      idAdmin: tarifa.idAdmin
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
      this.tarifaService.update(this.currentId, this.form).subscribe({
        next: () => {
          this.cargarTarifas();
          this.cerrarModal();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al actualizar';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.tarifaService.save(this.form).subscribe({
        next: () => {
          this.cargarTarifas();
          this.cerrarModal();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al crear';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta tarifa?')) {
      return;
    }

    this.loading = true;
    this.tarifaService.delete(id).subscribe({
      next: () => {
        this.cargarTarifas();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar';
        this.loading = false;
        console.error(err);
      }
    });
  }

  validarForm(): boolean {
    if (!this.form.tipoServicio || !this.form.precioHora || this.form.precioHora <= 0) {
      this.error = 'El tipo de servicio y precio son obligatorios';
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.form = {
      tipoServicio: 'FUTBOL_6',
      precioHora: 0,
      vigente: true,
      idAdmin: undefined
    };
    this.error = null;
  }

  getVigoenteBadgeClass(vigente: boolean): string {
    return vigente ? 'badge-success' : 'badge-danger';
  }
}