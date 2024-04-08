import { TiposExpediente } from '../../models/tipoExpediente.model'
import { TipoExpedienteService } from './../../service/tipoExpediente/tipo-expediente.service'
import { Component, OnInit } from '@angular/core'
import { TipoExpedienteModalComponent } from '../../formulario/tipo-expediente-modal/tipo-expediente-modal.component'
import { MatDialog } from '@angular/material/dialog'
import Swal from 'sweetalert2'
import { LoginService } from './../../service/login/login.service'
import { Router } from '@angular/router'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs'

@Component({
	selector: 'app-tipo-expediente',
	templateUrl: './tipo-expediente.component.html',
	styleUrl: './tipo-expediente.component.css',
})
export class TipoExpedienteComponent implements OnInit {
	dataSource: TiposExpediente[] = []
	displayedColumns: string[] = ['id', 'materia', 'acciones', 'activo', 'edit', 'delete']
	itemsFiltrados = this.dataSource

	constructor(
		private tipoExpedienteService: TipoExpedienteService,
		private dialog: MatDialog,
		private loginService: LoginService,
		private router: Router,
	) {}

	//	Metodo que se ejecuta al iniciar el componente
	//	Se llama del servicio la funcion getAllTipoExpediente para obtener todos los tipos de expediente
	//	y al obtener todos los tipos de expediente se almacenan en el dataSource

	ngOnInit(): void {
		this.tipoExpedienteService.getAllTipoExpediente().subscribe((tiposExpediente) => {
			this.dataSource = tiposExpediente
			this.dataSourceOriginal = tiposExpediente
		})

		if (!this.loginService.isAuthenticated()) {
			// Si el usuario no está autenticado, muestra un mensaje y luego redirige a la página de inicio de sesión
			window.alert('Redirigiendo a login, no estás autenticado')
			this.router.navigate(['/login'])
		}
	}

	//	Metodo que abre un modal para insertar un tipo de expediente
	//	Se crea un dialogo con el modal de tipoExpedienteModalComponent
	//	Al cerrar el modal al darle insertar se llama del servicio la funcion postInsertTipoExpediente para insertar el tipo de expediente
	//	y luego del suscribe llega la respuesta para insertar el nuevo tipo de expediente en el dataSource
	//	y se utiliza la funcion push para insertar el nuevo tipo de expediente en el dataSource

	modalInsertar(): void {
		const dialogRef = this.dialog.open(TipoExpedienteModalComponent, {
			width: '50%',
			data: { materia: '', acciones: '', activo: true },
		})

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				Swal.showLoading() // Muestra el spinner

				this.tipoExpedienteService
					.postInsertTipoExpediente(result.materia, result.acciones, result.activo)
					.pipe(
						catchError((error) => {
							Swal.hideLoading() // Oculta el spinner
							Swal.fire('Error!', 'Ha ocurrido un error al insertar el expediente.', 'error') // Muestra un mensaje de error
							return of(null)
						}),
					)
					.subscribe((tipoExpediente) => {
						if (tipoExpediente) {
							this.dataSource.push(tipoExpediente)
							this.dataSource = [...this.dataSource]

							Swal.hideLoading() // Oculta el spinner
							Swal.fire('Insertado!', 'El expediente ha sido insertado.', 'success') // Muestra un mensaje de éxito
						}
					})
			}
		})
	}

	//	Metodo que se le pasa por parametro el id y el activo para eliminar un tipo de expediente
	//	Se llama del servicio la funcion deleteTipoExpediente para eliminar el tipo de expediente
	//	Se recorre el dataSource que es donde se almacenan los tipos de expediente y se hace una comprobacion
	// 	de la respuesta del suscribe, si la respuesta del suscribe es igual a la respuesta de la funcion findIndex que tiene como parametro
	//  la varibale temporal tipo que si es igual al tipo de expediente que se quiere eliminar, se actualiza el dataSource
	//  para que sea activo o inactivo y se recarga la pagina

	deleteData(id: number, activo: boolean) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: '¿Deseas eliminar o activar este Tipo de expediente?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí',
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.showLoading() // Muestra el spinner

				this.tipoExpedienteService.deleteTipoExpediente(id, activo).subscribe((tipoExpediente) => {
					const index = this.dataSource.findIndex((tipo) => tipo.id === tipoExpediente.id)

					if (index !== -1) {
						this.dataSource[index] = tipoExpediente
						this.dataSource = [...this.dataSource]
					}

					Swal.hideLoading() // Oculta el spinner
					Swal.fire('Eliminado!', 'El expediente ha sido eliminado.', 'success') // Muestra un mensaje de éxito
						.then(() => {
							this.tipoExpedienteService.getAllTipoExpediente().subscribe((tiposExpediente) => {
								this.dataSource = tiposExpediente
								this.dataSourceOriginal = tiposExpediente
							})
							location.reload()
						})
				})
			}
		})
	}

	//	Metodo que se le pasa por parametro el id, la materia y las acciones para modificar un tipo de expediente
	// 	Se crea un dialogo con el modal de tipoExpedienteModalComponent
	//	Y se le pasa por parametro la materia y las acciones para que se muestren en el modal
	//	Al cerrar el modal al darle insertar se llama del servicio la funcion editTipoExpediente para modificar el tipo de expediente
	//	Se recorre el dataSource que es donde se almacenan los tipos de expediente y se hace una comprobacion
	// 	de la respuesta del suscribe, si la respuesta del suscribe es igual a la respuesta de la funcion findIndex que tiene como parametro
	//  la varibale temporal tipo que si es igual al tipo de expediente que se quiere modificar, se actualiza el dataSource
	//  con la nueva materia y la nueva accion y luego se actualiza el dataSource para reflejar los cambios en el array con los nuevos datos

	modalModificar(requestId: number, requestMateria: String, requestAcciones: String): void {
		const dialogRef = this.dialog.open(TipoExpedienteModalComponent, {
			width: '50%',
			data: { materia: requestMateria, acciones: requestAcciones },
		})

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				Swal.showLoading() // Muestra el spinner

				this.tipoExpedienteService
					.editTipoExpediente(requestId, result.materia, result.acciones)
					.pipe(
						catchError((error) => {
							Swal.hideLoading() // Oculta el spinner
							Swal.fire('Error!', 'Ha ocurrido un error al modificar el expediente.', 'error') // Muestra un mensaje de error
							return of(null)
						}),
					)
					.subscribe((tipoExpediente) => {
						if (tipoExpediente) {
							const index = this.dataSource.findIndex((tipo) => tipo.id === tipoExpediente.id)

							if (index !== -1) {
								this.dataSource[index] = tipoExpediente
							}
							this.dataSource = [...this.dataSource]

							Swal.hideLoading() // Oculta el spinner
							Swal.fire('Modificado!', 'El expediente ha sido modificado.', 'success') // Muestra un mensaje de éxito
						}
					})
			}
		})
	}

	//	Metodo que se le pasa por parametro la materia y el activo para filtrar los tipos de expediente
	//	Aun en construccion

	estadoBool: string = ''
	dataSourceOriginal: TiposExpediente[] = []

	applyFilter(): void {
		if (this.estadoBool === '') {
			this.tipoExpedienteService.getAllTipoExpediente().subscribe((expedientes) => {
				this.dataSource = expedientes
				this.dataSourceOriginal = expedientes
			})
		} else if (this.estadoBool === 'true') {
			this.dataSource = this.dataSourceOriginal.filter((expediente) => expediente.activo === true)
		} else if (this.estadoBool === 'false') {
			this.dataSource = this.dataSourceOriginal.filter((expediente) => expediente.activo === false)
		}
	}

	dataSourceFiltrada: TiposExpediente[] = []
	filtro: string = ''
	filtrarPorNombre(): void {
		this.tipoExpedienteService.getAllTipoExpediente().subscribe((tiposExpediente) => {
			this.dataSourceFiltrada = tiposExpediente
			if (this.filtro) {
				this.dataSource = this.dataSourceFiltrada.filter((tipoExpediente) =>
					tipoExpediente.materia.toLowerCase().includes(this.filtro.toLowerCase()),
				)
			} else {
				this.tipoExpedienteService
					.getAllTipoExpediente()
					.subscribe((tiposExpediente) => (this.dataSource = tiposExpediente))
			}
		})
	}
}
