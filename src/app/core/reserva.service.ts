import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReservaResponse {
  idReserva: number;
  clienteId: number;
  canchaId: number;
  tarifaId?: number;
  inicio: string;
  fin: string;
  incluirEntrenador: boolean;
  estado: string;
  totalPagar: number;
  creadoEn?: string;
  creadoPorAdminId?: number;
}

export interface ReservaRequest {
  clienteId: number;
  canchaId: number;
  tarifaId?: number;
  inicio: string;
  fin: string;
  incluirEntrenador: boolean;
  estado: string;
  totalPagar: number;
  creadoPorAdminId?: number;
}

// Alias para compatibilidad
export type Reserva = ReservaResponse;

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reservas`;

  findAll(): Observable<ReservaResponse[]> {
    return this.http.get<ReservaResponse[]>(this.apiUrl);
  }

  findById(id: number): Observable<ReservaResponse> {
    return this.http.get<ReservaResponse>(`${this.apiUrl}/${id}`);
  }

  save(dto: ReservaRequest): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(this.apiUrl, dto);
  }

  update(id: number, dto: ReservaRequest): Observable<ReservaResponse> {
    return this.http.put<ReservaResponse>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}