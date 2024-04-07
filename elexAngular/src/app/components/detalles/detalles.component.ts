import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Expedientes } from '../../models/expedientes.model'
import { ExpedienteService } from '../../service/expediente/expediente.service'
import { TiposExpediente } from '../../models/tipoExpediente.model'
import { TipoExpedienteService } from './../../service/tipoExpediente/tipo-expediente.service'
import { Actuaciones } from '../../models/actuaciones.model'
import { ActuacionesService } from './../../service/actuaciones/actuaciones.service'
import { Documentos } from '../../models/documentos.model'
import { DocumentosService } from './../../service/documentos/documentos.service'
import { delay } from 'rxjs/operators'
import { LoginService } from './../../service/login/login.service'
import { Router } from '@angular/router'

@Component({
	selector: 'app-detalles',
	templateUrl: './detalles.component.html',
	styleUrl: './detalles.component.css',
})
export class DetallesComponent implements OnInit {
	codigo: string
	id: number
	dataSourceExpediente: Expedientes[] = []
	columExpediente: string[] = ['id', 'codigo']

	columtipoExpediente: string[] = ['id', 'materia', 'acciones', 'activo']
	dataSourceTipoExpediente: TiposExpediente[] = []

	columActuaciones: string[] = ['id', 'fecha', 'descripcion', 'finalizado', 'observaciones', 'responsable']
	dataSourceActuaciones: Actuaciones[] = []

	columDocumentos: string[] = ['id', 'nombre', 'tipo', 'vigente', 'tasa']
	dataSourceDocumentos: Documentos[] = []

	constructor(
		private ExpedienteService: ExpedienteService,
		private tipoExpedienteService: TipoExpedienteService,
		private actuacionesService: ActuacionesService,
		private documentosService: DocumentosService,
		private route: ActivatedRoute,
		private loginService: LoginService,
		private router: Router,
	) {
		this.codigo = ''
		this.id = 0
	}

	ngOnInit() {
		let idTipoExpediente = 0
		this.route.paramMap.subscribe((params) => {
			this.codigo = params.get('codigo') ?? ''
			this.id = +params.get('id')!
		})

		this.ExpedienteService.getAllExpediente().subscribe((expedientes) => {
			if (this.codigo) {
				this.dataSourceExpediente = expedientes.filter((expediente) => expediente.codigo === this.codigo)
			}
		})

		this.actuacionesService.getAllActuaciones().subscribe((actuaciones) => {
			this.dataSourceActuaciones = actuaciones.filter((actuacion) => actuacion.expediente.codigo === this.codigo)
		})

		this.documentosService.getAllDocumentos().subscribe((documentos) => {
			this.dataSourceDocumentos = documentos.filter((documento) => documento.expediente.codigo === this.codigo)
		})

		this.tipoExpedienteService
			.getAllTipoExpediente()
			.pipe(delay(100))
			.subscribe((tiposExpediente) => {
				for (let i = 0; i < this.dataSourceExpediente.length; i++) {
					idTipoExpediente = this.dataSourceExpediente[i].tiposExpediente.id
				}

				this.dataSourceTipoExpediente = tiposExpediente.filter(
					(tipoExpediente) => tipoExpediente.id === idTipoExpediente,
				)
			})

		if (!this.loginService.isAuthenticated()) {
			// Si el usuario no está autenticado, muestra un mensaje y luego redirige a la página de inicio de sesión
			window.alert('Redirigiendo a login, no estás autenticado')
			this.router.navigate(['/login'])
		}
	}
}
