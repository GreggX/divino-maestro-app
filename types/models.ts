/**
 * Model Types
 * TypeScript type definitions for database models
 */

import { Types } from 'mongoose';

/**
 * Socio Types
 */
export type SocioTipo = 'socio' | 'aspirante' | 'primera';
export type ClaseAdorador =
  | 'aspirante'
  | 'prueba'
  | 'activo'
  | 'honorario'
  | 'baja'
  | 'inactivo';

/**
 * Vigilia Types
 */
export type VigiliaEstado =
  | 'programada'
  | 'en_curso'
  | 'finalizada'
  | 'cancelada';

/**
 * Cuota Types
 */
export type CuotaTipo = 'pago' | 'adeudo';
export type MetodoPago = 'efectivo' | 'transferencia' | 'otro';

/**
 * ActaJunta Types
 */
export interface ActaJuntaSummary {
  _id: Types.ObjectId;
  fecha: Date;
  lugar: string;
  referenciaParte: string;
  totalAsistencia: number;
  totalColecta: number;
}

/**
 * Resumen de Cuotas por Socio
 */
export interface ResumenCuotasSocio {
  socioId: Types.ObjectId;
  nombreCompleto: string;
  totalAdeudado: number;
  totalPagado: number;
  balance: number;
}

/**
 * Estadísticas de Vigilia
 */
export interface EstadisticasVigilia {
  vigiliaId: Types.ObjectId;
  totalSociosCitados: number;
  totalAsistencias: number;
  porcentajeAsistencia: number;
  totalCuotasRecaudadas: number;
}

/**
 * Turno de Guardia Detallado
 */
export interface TurnoGuardiaDetalle {
  rangoHora: string;
  horarioEspecifico: string;
  horaInicio: Date;
  horaFin: Date;
  duracionMinutos: number;
  primerCoro: {
    id: Types.ObjectId;
    nombre: string;
  }[];
  segundoCoro: {
    id: Types.ObjectId;
    nombre: string;
  }[];
}

/**
 * Movimientos de Miembros Consolidados
 */
export interface MovimientosMiembrosResumen {
  totalVigiliaPrueba: number;
  totalSolicitudesActivos: number;
  totalSolicitudesHonorarios: number;
  totalCambiosDomicilio: number;
  totalPropuestasBaja: number;
  totalPropuestasDistintivos: number;
}
