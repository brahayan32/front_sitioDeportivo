import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TarifaResponse {
  idTarifa: number;
  tipoServicio: string;
  precioHora: number;
  vigente: boolean;
  creadoEn?: string;
  idAdmin?: number;
}

export interface TarifaRequest {
  tipoServicio: string;
  precioHora: number;
  vigente: boolean;
  idAdmin?: number;
}

// Alias para compatibilidad
export type Tarifa = TarifaResponse;

@Injectable({ providedIn: 'root' })
export class TarifaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tarifas`;

  findAll(): Observable<TarifaResponse[]> {
    return this.http.get<TarifaResponse[]>(this.apiUrl);
  }

  // Alias para compatibilidad con código antiguo
  listar(): Observable<TarifaResponse[]> {
    return this.findAll();
  }

  findById(id: number): Observable<TarifaResponse> {
    return this.http.get<TarifaResponse>(`${this.apiUrl}/${id}`);
  }

  save(dto: TarifaRequest): Observable<TarifaResponse> {
    return this.http.post<TarifaResponse>(this.apiUrl, dto);
  }

  update(id: number, dto: TarifaRequest): Observable<TarifaResponse> {
    return this.http.put<TarifaResponse>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Alias para compatibilidad
  eliminar(id: number): Observable<void> {
    return this.delete(id);
  }

  findByTipoServicio(tipo: string): Observable<TarifaResponse[]> {
    return this.http.get<TarifaResponse[]>(`${this.apiUrl}/tipo/${tipo}`);
  }

  findVigentes(): Observable<TarifaResponse[]> {
    return this.http.get<TarifaResponse[]>(`${this.apiUrl}/vigentes`);
  }
}