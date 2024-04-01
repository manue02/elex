import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment.development'
import { HttpClient } from '@angular/common/http'
import { TiposExpediente } from '../../models/tipoExpediente.model'
import { Observable, catchError } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class TipoExpedienteService {
	private baseURL = `${environment.apiURL}/tiposExpedientes`

	constructor(private http: HttpClient) {}

	getAllTipoExpediente(): Observable<TiposExpediente[]> {
		const url = `${this.baseURL}/todos`
		return this.http.get<TiposExpediente[]>(url).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al obtener todos los TiposExpediente', error)
				throw error
			}),
		)
	}

	postInsertTipoExpediente(materia: String, acciones: String, activo: boolean): Observable<TiposExpediente> {
		const url = `${this.baseURL}/insertar/${materia}/${acciones}/${activo ? 'true' : 'false'}`
		return this.http.post<TiposExpediente>(url, {}).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al insertar el TipoExpediente', error)
				throw error
			}),
		)
	}

	deleteTipoExpediente(id: number, activo: boolean): Observable<TiposExpediente> {
		const url = `${this.baseURL}/eliminar/${id}/${activo}`
		return this.http.put<TiposExpediente>(url, {}).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al eliminar el TipoExpediente', error)
				throw error
			}),
		)
	}

	editTipoExpediente(id: number, materia: String, acciones: String): Observable<TiposExpediente> {
		const url = `${this.baseURL}/modificar/${id}/${materia}/${acciones}`
		return this.http.put<TiposExpediente>(url, {}).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al modificar el TipoExpediente', error)
				throw error
			}),
		)
	}
}
