import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService, ReporteResponse, ReporteRequest } from '../../../core/reporte.service';


@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  private reporteService = inject(ReporteService);

  reportes: ReporteResponse[] = [];
  loading = false;
  error: string | null = null;
  
  showModal = false;
  showFilters = false;
  isEditMode = false;
  currentId: number | null = null;

  tiposReporte = ['INGRESOS', 'OCUPACION_CANCHAS', 'DESEMPENO_ENTRENADOR', 'CLIENTES', 'GENERAL'];

  form: ReporteRequest = {
    administradorId: 0,
    reservaId: undefined,
    tipoReporte: '',
    descripcion: ''
  };

  filtros = {
    tipoReporte: '',
    fechaInicio: '',
    fechaFin: '',
    idCancha: '',
    idCliente: ''
  };

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.loading = true;
    this.error = null;

    this.reporteService.findAll().subscribe({
      next: (data: ReporteResponse[]) => {
        this.reportes = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar reportes';
        this.loading = false;
        console.error(err);
      }
    });
  }

  aplicarFiltros(): void {
    this.loading = true;
    this.error = null;

    // Filtro por fechas
    if (this.filtros.fechaInicio && this.filtros.fechaFin) {
      const inicio = new Date(this.filtros.fechaInicio)
  .toISOString()
  .substring(0, 19);

const fin = new Date(this.filtros.fechaFin)
  .toISOString()
  .substring(0, 19);

      this.reporteService.filtrarPorFechas(inicio, fin).subscribe({
        next: (data: ReporteResponse[]) => {
          this.reportes = data;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error al filtrar por fechas';
          this.loading = false;
          console.error(err);
        }
      });
      return;
    }

    // Filtro por cancha
    if (this.filtros.idCancha) {
      this.reporteService.filtrarPorCancha(parseInt(this.filtros.idCancha)).subscribe({
        next: (data: ReporteResponse[]) => {
          this.reportes = data;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error al filtrar por cancha';
          this.loading = false;
          console.error(err);
        }
      });
      return;
    }

    // Filtro por cliente
    if (this.filtros.idCliente) {
      this.reporteService.filtrarPorCliente(parseInt(this.filtros.idCliente)).subscribe({
        next: (data: ReporteResponse[]) => {
          this.reportes = data;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error al filtrar por cliente';
          this.loading = false;
          console.error(err);
        }
      });
      return;
    }

    this.cargarReportes();

    if (this.filtros.tipoReporte) {
  this.reportes = this.reportes.filter(
    r => r.tipoReporte === this.filtros.tipoReporte
  );
}

  }

  limpiarFiltros(): void {
    this.filtros = {
      tipoReporte: '',
      fechaInicio: '',
      fechaFin: '',
      idCancha: '',
      idCliente: ''
    };
    this.cargarReportes();
  }

  abrirModalNuevo(): void {
    this.isEditMode = false;
    this.currentId = null;
    this.resetForm();
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

    this.reporteService.save(this.form).subscribe({
      next: () => {
        this.cargarReportes();
        this.cerrarModal();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al crear reporte';
        this.loading = false;
        console.error(err);
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este reporte?')) {
      return;
    }

    this.loading = true;
    this.reporteService.delete(id).subscribe({
      next: () => {
        this.cargarReportes();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al eliminar reporte';
        this.loading = false;
        console.error(err);
      }
    });
  }

  descargarReporte(reporte: ReporteResponse): void {
    // Implementar descarga de PDF/Excel si es necesario
    console.log('Descargar reporte:', reporte);
    alert('Funcionalidad de descarga en desarrollo');
  }

  validarForm(): boolean {
    if (!this.form.administradorId || !this.form.tipoReporte) {
  this.error = 'Administrador y tipo de reporte son obligatorios';
  return false;
    }

    return true;
  }

  resetForm(): void {
    this.form = {
      administradorId: undefined as any,
      reservaId: undefined,
      tipoReporte: '',
      descripcion: ''
    };
    this.error = null;
  }

  getTipoReporteBadgeClass(tipo: string): string {
    switch (tipo) {
      case 'INGRESOS':
        return 'badge-primary';
      case 'OCUPACION_CANCHAS':
        return 'badge-info';
      case 'DESEMPENO_ENTRENADOR':
        return 'badge-success';
      case 'CLIENTES':
        return 'badge-warning';
      case 'GENERAL':
        return 'badge-secondary';
      default:
        return 'badge-default';
    }
  }
}