import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({ providedIn: 'root' })
export class BaseService {
  protected http = inject(HttpClient);
  protected baseUrl = 'http://localhost:8080';

  /**
   * GET: Obtener un elemento por ID
   * GET /endpoint/{id}
   */
  getById<T>(endpoint: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  /**
   * GET: Obtener lista de elementos
   * GET /endpoint
   */
  getAll<T>(endpoint: string, params?: PaginationParams): Observable<T> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
      if (params.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
    }

    return this.http.get<T>(
      `${this.baseUrl}/${endpoint}`,
      { params: httpParams }
    );
  }

  /**
   * POST: Crear nuevo elemento
   * POST /endpoint
   */
  create<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  /**
   * PUT: Actualizar elemento completo
   * PUT /endpoint/{id}
   */
  update<T>(endpoint: string, id: number | string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, data);
  }

  /**
   * PATCH: Actualizar elemento parcial
   * PATCH /endpoint/{id}
   */
  patch<T>(endpoint: string, id: number | string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}/${id}`, data);
  }

  /**
   * DELETE: Eliminar elemento
   * DELETE /endpoint/{id}
   */
  delete<T>(endpoint: string, id: number | string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  /**
   * POST: Método genérico para acciones personalizadas
   * POST /endpoint/{id}/action o POST /endpoint/action
   */
  customAction<T>(endpoint: string, actionOrId: number | string, actionOrData?: string | any, data?: any): Observable<T> {
    let url: string;
    let payload: any;

    // Si el tercer parámetro es string, es una acción con ID
    if (typeof actionOrData === 'string') {
      url = `${this.baseUrl}/${endpoint}/${actionOrId}/${actionOrData}`;
      payload = data;
    } else {
      // Si el tercer parámetro no es string, es una acción sin ID
      url = `${this.baseUrl}/${endpoint}/${actionOrId}`;
      payload = actionOrData;
    }

    return this.http.post<T>(url, payload);
  }

  /**
   * GET: Método genérico para queries personalizadas
   * GET /endpoint/action
   */
  customQuery<T>(endpoint: string, action: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<T>(
      `${this.baseUrl}/${endpoint}/${action}`,
      { params: httpParams }
    );
  }
}