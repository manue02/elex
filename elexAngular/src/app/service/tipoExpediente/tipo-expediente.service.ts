import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment.development'
import { HttpClient } from '@angular/common/http'
import { TiposExpediente } from '../../models/tipoExpediente.model'
import { Observable } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class TipoExpedienteService {
	private baseURL = `${environment.apiURL}/tiposExpedientes`

	constructor(private http: HttpClient) {}

	getAllTipoExpediente(): Observable<TiposExpediente[]> {
		const url = `${this.baseURL}/todos`
		return this.http.get<TiposExpediente[]>(url)
	}
}
