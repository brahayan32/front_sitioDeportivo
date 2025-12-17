import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ClienteResponse {
  idCliente: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
}

export interface ClienteRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clientes`;

  getMiPerfil(): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.apiUrl}/me`)
      .pipe(catchError(this.handleError));
  }

  findAll(): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  save(dto: ClienteRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(this.apiUrl, dto)
      .pipe(catchError(this.handleError));
  }

  updateMiPerfil(dto: ClienteRequest): Observable<ClienteResponse> {
    return this.http.put<ClienteResponse>(`${this.apiUrl}/me`, dto)
      .pipe(catchError(this.handleError));
  }

  update(id: number, dto: ClienteRequest): Observable<ClienteResponse> {
    return this.http.put<ClienteResponse>(`${this.apiUrl}/${id}`, dto)
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