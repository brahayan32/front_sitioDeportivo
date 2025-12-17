import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface EntrenadorResponse {
  idEntrenador: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  email: string;
  telefono: string;
  creadoEn: string;
}

export interface EntrenadorRequest {
  nombre: string;
  apellido: string;
  especialidad: string;
  email: string;
  telefono: string;
  password?: string;
}

export type Entrenador = EntrenadorResponse;

@Injectable({ providedIn: 'root' })
export class EntrenadorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/entrenadores`;

  findAll(): Observable<EntrenadorResponse[]> {
    return this.http.get<EntrenadorResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  findById(id: number): Observable<EntrenadorResponse> {
    return this.http.get<EntrenadorResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  save(dto: EntrenadorRequest): Observable<EntrenadorResponse> {
    return this.http.post<EntrenadorResponse>(this.apiUrl, dto)
      .pipe(catchError(this.handleError));
  }

  update(id: number, dto: EntrenadorRequest): Observable<EntrenadorResponse> {
    return this.http.put<EntrenadorResponse>(`${this.apiUrl}/${id}`, dto)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Error código ${error.status}: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error('No se pudo completar la operación. Intenta nuevamente.'));
  }
}