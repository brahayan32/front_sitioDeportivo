import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService, ReservaResponse, ReservaRequest } from '../../../core/reserva.service';
import { ClienteService } from '../../../core/cliente.service';
import { CanchaService } from '../../../core/cancha.service';
import { TarifaService, TarifaResponse } from '../../../core/tarifa.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})

export class ReservasComponent implements OnInit {
  clientes: any[] = [];
  canchas: any[] = [];
  tarifas: TarifaResponse[] = [];


  reservas: ReservaResponse[] = [];
  loading = false;
  error: string | null = null;

  showModal = false;
  isEditMode = false;
  currentId: number | null = null;

  form: ReservaRequest = {
    clienteId: 0,
    canchaId: 0,
    tarifaId: undefined,
    inicio: '',
    fin: '',
    incluirEntrenador: false,
    estado: 'PENDIENTE',
    totalPagar: 0,
    creadoPorAdminId: undefined
  };
  constructor(
    private reservaService: ReservaService,
    private clienteService: ClienteService,
    private canchaService: CanchaService,
    private tarifaService: TarifaService,
    private authService: AuthService
  ) { }


  calcularTotal(): void {
    if (!this.form.inicio || !this.form.fin || !this.form.tarifaId) {
      this.form.totalPagar = 0;
      return;
    }

    const inicio = new Date(this.form.inicio);
    const fin = new Date(this.form.fin);

    const horas = (fin.getTime() - inicio.getTime()) / 3600000;
    if (horas <= 0) {
      this.form.totalPagar = 0;
      return;
    }

    const tarifa = this.tarifas.find(t => t.idTarifa === this.form.tarifaId);
    this.form.totalPagar = tarifa ? horas * tarifa.precioHora : 0;
  }



  ngOnInit(): void {
  const idCliente = this.authService.getIdCliente();

  if (!idCliente) {
    this.error = 'No se pudo identificar el cliente autenticado';
    return;
  }

  this.form.clienteId = idCliente;

  this.cargarCanchas();
  this.cargarTarifas();
  this.cargarReservas();
}

  cargarTarifas(): void {
    this.tarifaService.findAll().subscribe({
      next: (data) => this.tarifas = data.filter(t => t.vigente),
      error: (err) => console.error('Error cargando tarifas', err)
    });
  }


  cargarReservas(): void {
  this.loading = true;
  this.error = null;

  const idCliente = this.authService.getIdCliente();

  this.reservaService.findAll().subscribe({
    next: (data) => {
      this.reservas = data.filter(
        r => r.clienteId === idCliente
      );
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Error al cargar tus reservas';
      this.loading = false;
      console.error(err);
    }
  });
}


  onCanchaChange(): void {
    const cancha = this.canchas.find(c => c.idCancha === this.form.canchaId);

    if (!cancha || !cancha.tarifaId) {
      this.form.tarifaId = undefined;
      this.form.totalPagar = 0;
      return;
    }

    this.form.tarifaId = cancha.tarifaId;
    this.calcularTotal();
  }

  cargarCanchas(): void {
    this.canchaService.findAll().subscribe({
      next: (data) => this.canchas = data,
      error: (err) => console.error('Error cargando canchas', err)
    });
  }


  abrirModalNuevo(): void {
    this.isEditMode = false;
    this.currentId = null;
    this.resetForm();
    this.showModal = true;
  }

  abrirModalEditar(reserva: ReservaResponse): void {
    this.isEditMode = true;
    this.currentId = reserva.idReserva;
    this.form = {
      clienteId: reserva.clienteId,
      canchaId: reserva.canchaId,
      tarifaId: reserva.tarifaId,
      inicio: reserva.inicio,
      fin: reserva.fin,
      incluirEntrenador: reserva.incluirEntrenador,
      estado: reserva.estado,
      totalPagar: reserva.totalPagar,
      creadoPorAdminId: reserva.creadoPorAdminId
    };
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.resetForm();
  }
  getNombreCliente(id: number): string {
    const cliente = this.clientes.find(c => c.idCliente === id);
    return cliente ? cliente.nombre : 'Cliente';
  }

  getNombreCancha(id: number): string {
    const cancha = this.canchas.find(c => c.idCancha === id);
    return cancha ? cancha.nombre : 'Cancha';
  }

  guardar(): void {
    if (!this.validarForm()) {
      return;
    }

    this.loading = true;

    const payload = this.normalizarFechas();

    if (this.isEditMode && this.currentId) {
      this.reservaService.update(this.currentId, payload).subscribe({

        next: () => {
          this.cargarReservas();
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
      this.reservaService.save(payload).subscribe({
        next: () => {
          this.cargarReservas();
          this.cerrarModal();
          this.loading = false;
        },
        error: (err) => {
          if (err.error?.message?.includes('ocupada')) {
            this.error = 'La cancha ya está reservada en ese horario';
          } else {
            this.error = 'Error al crear la reserva';
          }
          this.loading = false;
          console.error(err);
        }

      });
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta reserva?')) {
      return;
    }

    this.loading = true;
    this.reservaService.delete(id).subscribe({
      next: () => {
        this.cargarReservas();
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
    if (!this.form.clienteId || !this.form.canchaId || !this.form.inicio || !this.form.fin) {
      this.error = 'Todos los campos obligatorios deben ser completados';
      return false;
    }

    if (this.form.totalPagar === undefined || this.form.totalPagar < 0) {
      this.error = 'El total a pagar debe ser válido';
      return false;
    }
    if (new Date(this.form.fin) <= new Date(this.form.inicio)) {
      this.error = 'La fecha fin debe ser posterior a la fecha inicio';
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.form = {
      clienteId: 0,
      canchaId: 0,
      tarifaId: undefined,
      inicio: '',
      fin: '',
      incluirEntrenador: false,
      estado: 'PENDIENTE',
      totalPagar: 0,
      creadoPorAdminId: undefined

    };
    this.error = null;


  }
  private normalizarFechas(): ReservaRequest {
    return {
      ...this.form,
      inicio: this.form.inicio.length === 16
        ? this.form.inicio + ':00'
        : this.form.inicio,
      fin: this.form.fin.length === 16
        ? this.form.fin + ':00'
        : this.form.fin
    };
  }


  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'badge-warning';
      case 'CONFIRMADA':
        return 'badge-success';
      case 'CANCELADA':
        return 'badge-danger';
      case 'COMPLETADA':
        return 'badge-info';
      default:
        return 'badge-default';
    }
  }
}