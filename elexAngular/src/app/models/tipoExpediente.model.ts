export interface TiposExpediente {
  id: number;
  materia: string;
  acciones: string; // Asume que Acciones es un enum y se manejará como string en TypeScript
  activo: boolean;
}
