import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment.development'
import { HttpClient } from '@angular/common/http'
import { Observable, catchError, BehaviorSubject } from 'rxjs'
import { Documentos } from '../../models/documentos.model'

@Injectable({
	providedIn: 'root',
})
export class DocumentosService {
	private baseURL = `${environment.apiURL}/documentos`

	private _isInsertButtonClicked = new BehaviorSubject<boolean>(false)
	isInsertButtonClicked = this._isInsertButtonClicked.asObservable()

	constructor(private http: HttpClient) {}

	getAllDocumentos(): Observable<Documentos[]> {
		const url = `${this.baseURL}/todos`
		return this.http.get<Documentos[]>(url).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al obtener todos los Documentos', error)
				throw error
			}),
		)
	}

	postInsertDocumentos(
		file: File,
		tasa: number,
		vigente: boolean,
		nombre: String,
		tipo: String,
		expediente: number,
	): Observable<Documentos> {
		const formData = new FormData()
		formData.append('file', file)

		const url = `${this.baseURL}/insertar/${tasa}/${vigente}/${nombre}/${tipo}/${expediente}`
		console.log(url)

		return this.http.post<Documentos>(url, formData).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al insertar Documentos', error)
				throw error
			}),
		)
	}

	putModificarDocumentos(
		id: number,
		tasa: number,
		nombre: String,
		tipo: String,
		expediente: number,
	): Observable<Documentos> {
		const url = `${this.baseURL}/modificar/${id}/${tasa}/${nombre}/${tipo}/${expediente}`
		return this.http.put<Documentos>(url, {}).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al modificar Documentos', error)
				throw error
			}),
		)
	}

	deleteDocumentos(id: number, vigente: boolean): Observable<Documentos> {
		const url = `${this.baseURL}/eliminar/${id}/${vigente}`
		return this.http.put<Documentos>(url, {}).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al eliminar Documentos', error)
				throw error
			}),
		)
	}

	descargarBlob(id: number): Observable<Blob> {
		const url = `${this.baseURL}/descargar-blob/${id}`
		return this.http.get(url, { responseType: 'blob' }).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al descargar Documentos', error)
				throw error
			}),
		)
	}

	descargarArchivo(nombre: String): Observable<any> {
		const url = `${this.baseURL}/descargar/${nombre}`
		return this.http.get(url, { responseType: 'blob' }).pipe(
			catchError((error) => {
				console.error('Ocurrió un error al descargar Documentos', error)
				throw error
			}),
		)
	}
}
