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
		'activo',
		'opciones',
		'descripcion',
		'idTipoExpediente',
		'delete',
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
			this.dataSourceOriginal = expedientes
			this.dataSourceOriginalActivo = expedientes
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
				activo: true,
			},
		})

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				Swal.showLoading() // Muestra el spinner

				this.ExpedienteService.postInsertExpediente(
					result.idTipoExpediente,
					result.codigo,
					result.fecha,
					result.activo,
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
								.then(() => {
									this.ExpedienteService.getAllExpediente().subscribe((expedientes) => {
										this.dataSource = expedientes
										this.dataSourceOriginal = expedientes
										this.dataSourceOriginalActivo = expedientes
									})
								})
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
								.then(() => {
									location.reload()
								})
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
								.then(() => {
									this.ExpedienteService.getAllExpediente().subscribe((expedientes) => {
										this.dataSource = expedientes
										this.dataSourceOriginal = expedientes
										this.dataSourceOriginalActivo = expedientes
									})
								})
						}
					})
			}
		})
	}

	deleteData(id: number, activo: boolean) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: '¡No podrás revertir esto!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: '¡Sí, bórralo!',
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.showLoading() // Muestra el spinner

				this.ExpedienteService.deleteExpediente(id, activo).subscribe((expediente) => {
					const index = this.dataSource.findIndex((expediente) => expediente.id === id)

					if (index !== -1) {
						this.dataSource[index] = expediente
						this.dataSource = [...this.dataSource]

						Swal.hideLoading() // Oculta el spinner
						Swal.fire('¡Eliminado!', 'El expediente ha sido eliminado.', 'success') // Muestra un mensaje de éxito
							.then(() => {
								this.ExpedienteService.getAllExpediente().subscribe((expedientes) => {
									this.dataSource = expedientes
									this.dataSourceOriginal = expedientes
									this.dataSourceOriginalActivo = expedientes
								})
								location.reload()
							})
					}
				})
			}
		})
	}

	filtro: string = ''
	dataSourceFiltrada: Expedientes[] = []
	filtrarPorNombre(): void {
		this.ExpedienteService.getAllExpediente().subscribe((expedientes) => {
			this.dataSourceFiltrada = expedientes

			if (this.filtro) {
				this.dataSource = this.dataSourceFiltrada.filter((tipoExpediente) =>
					tipoExpediente.codigo.toLowerCase().includes(this.filtro.toLowerCase()),
				)
			} else {
				this.ExpedienteService.getAllExpediente().subscribe((tiposExpediente) => (this.dataSource = tiposExpediente))
			}
		})
	}

	estadoBool: string = ''
	dataSourceOriginal: Expedientes[] = []
	estadoBoolActivo: string = ''
	dataSourceOriginalActivo: Expedientes[] = []

	applyFilter(): void {
		this.ExpedienteService.getAllExpediente().subscribe((expedientes) => {
			this.dataSourceOriginal = expedientes
			this.dataSourceOriginalActivo = expedientes

			if (this.estadoBool !== '') {
				if (this.estadoBool === 'Pendiente') {
					this.dataSourceOriginal = this.dataSourceOriginal.filter((expediente) => expediente.estado === 'Pendiente')
				} else if (this.estadoBool === 'Enviado') {
					this.dataSourceOriginal = this.dataSourceOriginal.filter((expediente) => expediente.estado === 'Enviado')
				} else {
					this.dataSourceOriginal = this.dataSourceOriginal.filter((expediente) => expediente.estado === 'Erróneo')
				}
			}

			if (this.estadoBoolActivo !== '') {
				if (this.estadoBoolActivo === 'true') {
					this.dataSourceOriginalActivo = this.dataSourceOriginalActivo.filter(
						(expediente) => expediente.activo === true,
					)
					for (let i = 0; i < this.dataSourceOriginalActivo.length; i++) {
						console.log(this.dataSourceOriginalActivo[i])
					}
				}

				if (this.estadoBoolActivo === 'false') {
					this.dataSourceOriginalActivo = this.dataSourceOriginalActivo.filter(
						(expediente) => expediente.activo === false,
					)

					for (let i = 0; i < this.dataSourceOriginalActivo.length; i++) {
						console.log(this.dataSourceOriginalActivo[i])
					}
				}
			}

			this.dataSource = this.dataSourceOriginal.filter((expediente) =>
				this.dataSourceOriginalActivo.includes(expediente),
			)
		})
	}
}
