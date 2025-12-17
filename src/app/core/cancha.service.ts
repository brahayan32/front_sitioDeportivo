import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type TipoCancha = 'FUTBOL_6' | 'PADEL';
export type EstadoCancha = 'DISPONIBLE' | 'MANTENIMIENTO' | 'INACTIVA';

export interface CanchaResponse {
  idCancha: number;
  nombre: string;
  tipo: TipoCancha;
  estado: EstadoCancha;
  descripcion: string;
}

export interface CanchaRequest {
  nombre: string;
  tipo: TipoCancha;
  estado: EstadoCancha;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class CanchaService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/canchas`;

  findAll(): Observable<CanchaResponse[]> {
    return this.http.get<CanchaResponse[]>(this.apiUrl);
  }

  save(dto: CanchaRequest): Observable<CanchaResponse> {
    return this.http.post<CanchaResponse>(this.apiUrl, dto);
  }

  update(id: number, dto: CanchaRequest): Observable<CanchaResponse> {
    return this.http.put<CanchaResponse>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
