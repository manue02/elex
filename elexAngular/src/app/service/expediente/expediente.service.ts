import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment.development'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Expedientes } from '../../models/expedientes.model'
import { Estado } from '../../models/estado.enum'

@Injectable({
	providedIn: 'root',
})
export class ExpedienteService {
	private baseURL = `${environment.apiURL}/expedientes`

	constructor(private http: HttpClient) {}

	getAllExpediente(): Observable<Expedientes[]> {
		const url = `${this.baseURL}/todos`
		return this.http.get<Expedientes[]>(url).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al obtener todos los Expediente', error)
				throw error
			}),
		)
	}

	postInsertExpediente(
		idTipoExpediente: number,
		codigo: string,
		fecha: Date,
		activo: boolean,
		estado: Estado,
		opciones: string,
		descripcion: string,
	): Observable<Expedientes> {
		const url = `${this.baseURL}/insertar/${idTipoExpediente}/${codigo}/${fecha}/${activo}/${estado}/${opciones}/${descripcion}`
		return this.http.post<Expedientes>(url, {}).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al insertar el Expediente', error)
				throw error
			}),
		)
	}

	putModificarExpediente(
		id: number,
		idTipoExpediente: number,
		codigo: string,
		fecha: Date,
		estado: Estado,
		opciones: string,
		descripcion: string,
	): Observable<Expedientes> {
		const url = `${this.baseURL}/modificar/${id}/${idTipoExpediente}/${codigo}/${fecha}/${estado}/${opciones}/${descripcion}`
		console.log(url)
		return this.http.put<Expedientes>(url, {}).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al modificar el Expediente', error)
				throw error
			}),
		)
	}

	deleteExpediente(id: number, activo: boolean): Observable<Expedientes> {
		const url = `${this.baseURL}/eliminar/${id}/${activo}`
		return this.http.put<Expedientes>(url, {}).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al eliminar el Expediente', error)
				throw error
			}),
		)
	}
}
