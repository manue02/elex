import { Documentos } from './documentos.model'
import { TiposExpediente } from './tipoExpediente.model'
import { Actuaciones } from './actuaciones.model'

export interface Expedientes {
	id: number
	codigo: string
	fecha: string // En TypeScript, las fechas suelen manejarse como strings en formato ISO 8601
	estado: string // Asume que Estado es un enum y se manejará como string en TypeScript
	opciones: string
	descripcion: string
	activo: boolean
	documentos: Documentos[]
	actuaciones: Actuaciones[]
	tiposExpediente: TiposExpediente // Asume que tienes una interfaz TiposExpediente definida
}
