import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment.development'
import { HttpClient } from '@angular/common/http'
import { Observable, catchError } from 'rxjs'
import { Actuaciones } from '../../models/actuaciones.model'

@Injectable({
	providedIn: 'root',
})
export class ActuacionesService {
	private baseURL = `${environment.apiURL}/actuaciones`

	constructor(private http: HttpClient) {}

	getAllActuaciones(): Observable<Actuaciones[]> {
		const url = `${this.baseURL}/todos`
		return this.http.get<Actuaciones[]>(url).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al obtener todas las Actuaciones', error)
				throw error
			}),
		)
	}

	postInsertActuacion(
		idExpediente: number,
		responsable: string,
		fecha: Date,
		descripcion: string,
		observaciones: string,
		finalizado: boolean,
	): Observable<Actuaciones> {
		const url = `${this.baseURL}/insertar/${descripcion}/${finalizado}/${fecha}/${idExpediente}/${observaciones}/${responsable}`
		return this.http.post<Actuaciones>(url, {}).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al insertar la Actuación', error)
				throw error
			}),
		)
	}

	putModificarActuacion(
		id: number,
		idExpediente: number,
		responsable: string,
		fecha: Date,
		descripcion: string,
		observaciones: string,
		finalizado: boolean,
	): Observable<Actuaciones> {
		const url = `${this.baseURL}/modificar/${id}/${descripcion}/${finalizado}/${fecha}/${idExpediente}/${observaciones}/${responsable}`
		return this.http.put<Actuaciones>(url, {}).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al modificar la Actuación', error)
				throw error
			}),
		)
	}

	deleteActuacion(id: number, finalizado: boolean): Observable<Actuaciones> {
		const url = `${this.baseURL}/eliminar/${id}/${finalizado}`
		return this.http.put<Actuaciones>(url, {}).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al eliminar la Actuación', error)
				throw error
			}),
		)
	}
}
