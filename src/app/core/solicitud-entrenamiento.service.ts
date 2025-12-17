import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface SolicitudEntrenamientoRequestDTO {
  idCliente: number;
  idEntrenador?: number | null;
  inicio: string; // LocalDateTime en formato ISO
  fin: string;    // LocalDateTime en formato ISO
  estado: string;
}

export interface SolicitudEntrenamientoResponseDTO {
  idSolicitud: number;
  idCliente: number;
  idEntrenador?: number | null;
  inicio: string;
  fin: string;
  estado: string;
  creadoEn: string;
}

@Injectable({ providedIn: 'root' })
export class SolicitudEntrenamientoService extends BaseService {

  /**
   * Obtener todas las solicitudes
   * GET /solicitudes
   */
  listar(): Observable<SolicitudEntrenamientoResponseDTO[]> {
    return this.getAll<SolicitudEntrenamientoResponseDTO[]>('solicitudes');
  }

  /**
   * Obtener solicitud por ID
   * GET /solicitudes/{id}
   */
  obtener(id: number): Observable<SolicitudEntrenamientoResponseDTO> {
    return this.getById<SolicitudEntrenamientoResponseDTO>('solicitudes', id);
  }

  /**
   * Crear nueva solicitud de entrenamiento
   * POST /solicitudes
   */
  crear(solicitud: SolicitudEntrenamientoRequestDTO): Observable<SolicitudEntrenamientoResponseDTO> {
    return this.create<SolicitudEntrenamientoResponseDTO>('solicitudes', solicitud);
  }

  /**
   * Actualizar solicitud
   * PUT /solicitudes/{id}
   */
  actualizar(id: number, solicitud: SolicitudEntrenamientoRequestDTO): Observable<SolicitudEntrenamientoResponseDTO> {
    return this.update<SolicitudEntrenamientoResponseDTO>('solicitudes', id, solicitud);
  }

  /**
   * Eliminar solicitud
   * DELETE /solicitudes/{id}
   */
  eliminar(id: number): Observable<void> {
    return this.delete<void>('solicitudes', id);
  }

  /**
   * ✅ NUEVO: Obtener solicitudes por entrenador
   * GET /solicitudes/entrenador/{idEntrenador}
   */
  listarPorEntrenador(idEntrenador: number): Observable<SolicitudEntrenamientoResponseDTO[]> {
    return this.customQuery<SolicitudEntrenamientoResponseDTO[]>('solicitudes', `entrenador/${idEntrenador}`);
  }

  /**
   * ✅ NUEVO: Obtener solicitudes disponibles (sin entrenador asignado)
   * GET /solicitudes/disponibles
   */
  listarDisponibles(): Observable<SolicitudEntrenamientoResponseDTO[]> {
    return this.customQuery<SolicitudEntrenamientoResponseDTO[]>('solicitudes', 'disponibles');
  }

  /**
   * ✅ NUEVO: Aceptar una solicitud asignando entrenador
   * PUT /solicitudes/{id}/aceptar/{idEntrenador}
   */
  aceptarSolicitud(id: number, idEntrenador: number): Observable<SolicitudEntrenamientoResponseDTO> {
    return this.customAction<SolicitudEntrenamientoResponseDTO>('solicitudes', id, `aceptar/${idEntrenador}`);
  }

  /**
   * ✅ NUEVO: Rechazar una solicitud
   * PUT /solicitudes/{id}/rechazar
   */
  rechazarSolicitud(id: number): Observable<SolicitudEntrenamientoResponseDTO> {
    return this.customAction<SolicitudEntrenamientoResponseDTO>('solicitudes', id, 'rechazar');
  }
}