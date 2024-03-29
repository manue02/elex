import { TiposExpediente } from '../../models/tipoExpediente.model'
import { TipoExpedienteService } from './../../service/tipoExpediente/tipo-expediente.service'
import { Component, OnInit } from '@angular/core'

@Component({
	selector: 'app-tipo-expediente',
	templateUrl: './tipo-expediente.component.html',
	styleUrl: './tipo-expediente.component.css',
})
export class TipoExpedienteComponent implements OnInit {
	tiposExpediente: TiposExpediente[] = []

	constructor(private tipoExpedienteService: TipoExpedienteService) {}

	ngOnInit(): void {
		this.tipoExpedienteService.getAllTipoExpediente().subscribe((tiposExpediente) => {
			this.tiposExpediente = tiposExpediente
			console.log(this.tiposExpediente)
		})
	}
}
