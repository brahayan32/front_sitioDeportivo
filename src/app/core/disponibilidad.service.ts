import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DisponibilidadResponse {
  idDisponibilidad: number;
  idEntrenador: number;
  entrenadorNombre: string;
  diaDesSemana: string;
  horaInicio: string;
  horaFin: string;
}

export interface DisponibilidadRequest {
  idEntrenador: number;
  diaDesSemana: string;
  horaInicio: string;
  horaFin: string;
}

// Alias para compatibilidad
export type Disponibilidad = DisponibilidadResponse;

@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/disponibilidad`;

  /**
   * Obtener todas las disponibilidades
   * GET /disponibilidad
   */
  findAll(): Observable<DisponibilidadResponse[]> {
    return this.http.get<DisponibilidadResponse[]>(this.apiUrl);
  }

  /**
   * Obtener disponibilidad por ID
   * GET /disponibilidad/{id}
   */
  findById(id: number): Observable<DisponibilidadResponse> {
    return this.http.get<DisponibilidadResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nueva disponibilidad
   * POST /disponibilidad
   */
  save(dto: DisponibilidadRequest): Observable<DisponibilidadResponse> {
    return this.http.post<DisponibilidadResponse>(this.apiUrl, dto);
  }

  /**
   * Actualizar disponibilidad
   * PUT /disponibilidad/{id}
   */
  update(id: number, dto: DisponibilidadRequest): Observable<DisponibilidadResponse> {
    return this.http.put<DisponibilidadResponse>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Eliminar disponibilidad
   * DELETE /disponibilidad/{id}
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener disponibilidades por entrenador
   * GET /disponibilidad/entrenador/{idEntrenador}
   */
  findByEntrenador(idEntrenador: number): Observable<DisponibilidadResponse[]> {
    return this.http.get<DisponibilidadResponse[]>(`${this.apiUrl}/entrenador/${idEntrenador}`);
  }

  /**
   * Obtener disponibilidades por día
   * GET /disponibilidad/dia/{dia}
   */
  findByDia(dia: string): Observable<DisponibilidadResponse[]> {
    return this.http.get<DisponibilidadResponse[]>(`${this.apiUrl}/dia/${dia}`);
  }
}