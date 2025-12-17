import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService, PagoResponse, PagoRequest } from '../../../core/pago.service';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {
  private pagoService = inject(PagoService);

  pagos: PagoResponse[] = [];
  loading = false;
  error: string | null = null;
  
  showModal = false;
  isEditMode = false;
  currentId: number | null = null;

  metodos = ['TARJETA', 'TRANSFERENCIA', 'EFECTIVO', 'OTRO'];
  estados = ['PENDIENTE', 'PAGADO', 'RECHAZADO', 'CANCELADO'];

  form: PagoRequest = {
    idReserva: 0,
    idCliente: 0,
    monto: 0,
    metodo: 'TARJETA',
    estadoPago: 'PENDIENTE'
  };

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.loading = true;
    this.error = null;

    this.pagoService.findAll().subscribe({
      next: (data: PagoResponse[]) => {
        this.pagos = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar pagos';
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

  abrirModalEditar(pago: PagoResponse): void {
    this.isEditMode = true;
    this.currentId = pago.idPago;
    this.form = {
      idReserva: pago.idReserva,
      idCliente: pago.idCliente,
      monto: pago.monto,
      metodo: pago.metodo,
      estadoPago: pago.estadoPago
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
      this.pagoService.update(this.currentId, this.form).subscribe({
        next: () => {
          this.cargarPagos();
          this.cerrarModal();
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error al actualizar';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.pagoService.save(this.form).subscribe({
        next: () => {
          this.cargarPagos();
          this.cerrarModal();
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error al crear';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este pago?')) {
      return;
    }

    this.loading = true;
    this.pagoService.delete(id).subscribe({
      next: () => {
        this.cargarPagos();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al eliminar';
        this.loading = false;
        console.error(err);
      }
    });
  }

  validarForm(): boolean {
    if (!this.form.idReserva || !this.form.idCliente || !this.form.monto || this.form.monto <= 0) {
      this.error = 'Todos los campos son obligatorios y el monto debe ser mayor a 0';
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.form = {
      idReserva: 0,
      idCliente: 0,
      monto: 0,
      metodo: 'TARJETA',
      estadoPago: 'PENDIENTE'
    };
    this.error = null;
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'PAGADO':
        return 'badge-success';
      case 'PENDIENTE':
        return 'badge-warning';
      case 'RECHAZADO':
      case 'CANCELADO':
        return 'badge-danger';
      default:
        return 'badge-default';
    }
  }
}