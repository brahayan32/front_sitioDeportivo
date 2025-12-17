import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReporteRequest {
  administradorId: number;
  reservaId?: number;
  tipoReporte: string;
  descripcion?: string;
}

export interface ReporteResponse {
  idReporte: number;
  administradorId: number;
  reservaId?: number;
  tipoReporte: string;
  descripcion?: string;
  fechaGenerado: string;
}

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reportes`;

  /**
   * Obtener todos los reportes
   * GET /reportes
   */
  findAll(): Observable<ReporteResponse[]> {
    return this.http.get<ReporteResponse[]>(this.apiUrl);
  }

  /**
   * Obtener reporte por ID
   * GET /reportes/{id}
   */
  findById(id: number): Observable<ReporteResponse> {
    return this.http.get<ReporteResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nuevo reporte
   * POST /reportes
   */
  save(reporte: ReporteRequest): Observable<ReporteResponse> {
    return this.http.post<ReporteResponse>(this.apiUrl, reporte);
  }

  /**
   * Eliminar reporte
   * DELETE /reportes/{id}
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Filtrar reportes por fechas
   * GET /reportes/filtro/fechas?inicio=...&fin=...
   */
  filtrarPorFechas(inicio: string, fin: string): Observable<ReporteResponse[]> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fin', fin);
    
    return this.http.get<ReporteResponse[]>(
      `${this.apiUrl}/filtro/fechas`,
      { params }
    );
  }

  /**
   * Filtrar reportes por cancha
   * GET /reportes/filtro/cancha/{idCancha}
   */
  filtrarPorCancha(idCancha: number): Observable<ReporteResponse[]> {
    return this.http.get<ReporteResponse[]>(
      `${this.apiUrl}/filtro/cancha/${idCancha}`
    );
  }

  /**
   * Filtrar reportes por cliente
   * GET /reportes/filtro/cliente/{idCliente}
   */
  filtrarPorCliente(idCliente: number): Observable<ReporteResponse[]> {
    return this.http.get<ReporteResponse[]>(
      `${this.apiUrl}/filtro/cliente/${idCliente}`
    );
  }
}