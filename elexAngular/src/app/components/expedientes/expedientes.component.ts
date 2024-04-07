import { Component, OnInit } from '@angular/core'
import { Expedientes } from '../../models/expedientes.model'
import { ExpedienteService } from '../../service/expediente/expediente.service'
import { MatDialog } from '@angular/material/dialog'
import { ExpedienteModalComponent } from '../../formulario/expediente-modal/expediente-modal.component'
import { Estado } from '../../models/estado.enum'
import Swal from 'sweetalert2'
import { LoginService } from './../../service/login/login.service'
import { Router } from '@angular/router'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs'

@Component({
	selector: 'app-expedientes',
	templateUrl: './expedientes.component.html',
	styleUrl: './expedientes.component.css',
})
export class ExpedientesComponent implements OnInit {
	dataSource: Expedientes[] = []
	displayedColumns: string[] = [
		'id',
		'codigo',
		'fecha',
		'estado',
		'opciones',
		'descripcion',
		'idTipoExpediente',
		'edit',
		'detalles',
	]

	constructor(
		private ExpedienteService: ExpedienteService,
		private dialog: MatDialog,
		private loginService: LoginService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.ExpedienteService.getAllExpediente().subscribe((expedientes) => {
			this.dataSource = expedientes
		})
		if (!this.loginService.isAuthenticated()) {
			// Si el usuario no está autenticado, muestra un mensaje y luego redirige a la página de inicio de sesión
			window.alert('Redirigiendo a login, no estás autenticado')
			this.router.navigate(['/login'])
		}
	}

	modalInsertar(): void {
		const dialogRef = this.dialog.open(ExpedienteModalComponent, {
			width: '23%',
			data: {
				codigo: '',
				fecha: new Date(),
				estado: Estado,
				opciones: '',
				descripcion: '',
				idTipoExpediente: 0,
			},
		})

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				Swal.showLoading() // Muestra el spinner

				this.ExpedienteService.postInsertExpediente(
					result.idTipoExpediente,
					result.codigo,
					result.fecha,
					result.estado,
					result.opciones,
					result.descripcion,
				)
					.pipe(
						catchError((error) => {
							Swal.hideLoading() // Oculta el spinner
							Swal.fire('Error!', 'Ha ocurrido un error al insertar el expediente.', 'error') // Muestra un mensaje de error
							return of(null)
						}),
					)
					.subscribe((expediente) => {
						if (expediente) {
							this.dataSource.push(expediente)
							this.dataSource = [...this.dataSource]

							Swal.hideLoading() // Oculta el spinner
							Swal.fire('Insertado!', 'El expediente ha sido insertado.', 'success') // Muestra un mensaje de éxito
						}
					})
			}
		})
	}
	modalModificar(id: number): void {
		const dialogRef = this.dialog.open(ExpedienteModalComponent, {
			width: '23%',
			data: this.dataSource.find((expediente) => expediente.id === id),
		})

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				Swal.showLoading() // Muestra el spinner

				this.ExpedienteService.putModificarExpediente(
					result.id,
					result.idTipoExpediente,
					result.codigo,
					result.fecha,
					result.estado,
					result.opciones,
					result.descripcion,
				)
					.pipe(
						catchError((error) => {
							Swal.hideLoading() // Oculta el spinner
							Swal.fire('Error!', 'Ha ocurrido un error al modificar el expediente.', 'error') // Muestra un mensaje de error
							return of(null)
						}),
					)
					.subscribe((expediente) => {
						if (expediente) {
							const index = this.dataSource.findIndex((expediente) => expediente.id === id)
							this.dataSource[index] = expediente
							this.dataSource = [...this.dataSource]

							Swal.hideLoading() // Oculta el spinner
							Swal.fire('Modificado!', 'El expediente ha sido modificado.', 'success') // Muestra un mensaje de éxito
						}
					})
			}
		})
	}

	filtro: string = ''
	filtrarPorNombre(): void {
		if (this.filtro) {
			this.dataSource = this.dataSource.filter((tipoExpediente) =>
				tipoExpediente.codigo.toLowerCase().includes(this.filtro.toLowerCase()),
			)
		} else {
			this.ExpedienteService.getAllExpediente().subscribe((tiposExpediente) => (this.dataSource = tiposExpediente))
		}
	}

	estadoBool: string = ''

	applyFilter(): void {
		if (this.estadoBool === '') {
			this.ExpedienteService.getAllExpediente().subscribe((expedientes) => {
				this.dataSource = expedientes
			})
		} else if (this.estadoBool === 'Pendiente') {
			this.dataSource = this.dataSource.filter((expediente) => expediente.estado === 'Pendiente')
			this.estadoBool = ''
		} else if (this.estadoBool === 'Enviado') {
			this.dataSource = this.dataSource.filter((expediente) => expediente.estado === 'Enviado')
			this.estadoBool = ''
		} else {
			this.dataSource = this.dataSource.filter((expediente) => expediente.estado === 'Erróneo')
			this.estadoBool = ''
		}
	}
}
