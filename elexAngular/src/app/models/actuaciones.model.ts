import { Expedientes } from './expedientes.model';

export interface Actuaciones {
  id: number;
  descripcion: string;
  finalizado: boolean;
  fecha: string; // En TypeScript, las fechas suelen manejarse como strings en formato ISO 8601
  observaciones: string;
  responsable: string;
  expediente: Expedientes; // Asume que tienes una interfaz Expedientes definida
}
