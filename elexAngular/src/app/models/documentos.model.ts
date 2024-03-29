import { Expedientes } from './expedientes.model';

export interface Documentos {
  id: number;
  ruta: string;
  tasa: number;
  vigente: boolean;
  nombre: string;
  tipo: string;
  expediente: Expedientes; // Asume que tienes una interfaz Expedientes definida
}
