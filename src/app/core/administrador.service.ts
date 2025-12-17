import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AdministradorResponse {
  idAdministrador: number;
  nombre: string;
  apellido: string;
  usuario: string;
  rol: string;
}

export interface AdministradorRequest {
  nombre: string;
  apellido: string;
  usuario: string;
  rol: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class AdministradorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/administradores`;

  findAll(): Observable<AdministradorResponse[]> {
    return this.http.get<AdministradorResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  findById(id: number): Observable<AdministradorResponse> {
    return this.http.get<AdministradorResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  save(dto: AdministradorRequest): Observable<AdministradorResponse> {
    return this.http.post<AdministradorResponse>(this.apiUrl, dto)
      .pipe(catchError(this.handleError));
  }

  update(id: number, dto: AdministradorRequest): Observable<AdministradorResponse> {
    return this.http.put<AdministradorResponse>(`${this.apiUrl}/${id}`, dto)
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