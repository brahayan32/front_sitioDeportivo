import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PagoResponse {
  idPago: number;
  idReserva: number;
  idCliente: number;
  monto: number;
  metodo: string;
  estadoPago: string;
  fechaPago: string;
  procesadoPorAdmin?: number;
}

export interface PagoRequest {
  idReserva: number;
  idCliente: number;
  monto: number;
  metodo: string;
  estadoPago: string;
}

// Alias para compatibilidad
export type Pago = PagoResponse;

@Injectable({ providedIn: 'root' })
export class PagoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pagos`;

  findAll(): Observable<PagoResponse[]> {
    return this.http.get<PagoResponse[]>(this.apiUrl);
  }

  findById(id: number): Observable<PagoResponse> {
    return this.http.get<PagoResponse>(`${this.apiUrl}/${id}`);
  }

  save(dto: PagoRequest): Observable<PagoResponse> {
    return this.http.post<PagoResponse>(this.apiUrl, dto);
  }

  update(id: number, dto: PagoRequest): Observable<PagoResponse> {
    return this.http.put<PagoResponse>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}