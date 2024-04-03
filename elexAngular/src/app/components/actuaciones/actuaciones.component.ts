import { Component, OnInit } from '@angular/core'
import { Actuaciones } from '../../models/actuaciones.model'
import { ActuacionesService } from './../../service/actuaciones/actuaciones.service'
import { MatDialog } from '@angular/material/dialog'
import { ActuacionesModalComponent } from '../../formulario/actuaciones-modal/actuaciones-modal.component'
import Swal from 'sweetalert2'

@Component({
	selector: 'app-actuaciones',
	templateUrl: './actuaciones.component.html',
	styleUrl: './actuaciones.component.css',
})
export class ActuacionesComponent implements OnInit {
	dataSource: Actuaciones[] = []
	displayedColumns: string[] = [
		'id',
		'expediente',
		'responsable',
		'fecha',
		'descripcion',
		'finalizado',
		'observaciones',
		'edit',
		'delete',
	]

	constructor(private actuacionesService: ActuacionesService, private dialog: MatDialog) {}

	ngOnInit(): void {
		this.actuacionesService.getAllActuaciones().subscribe((actuaciones) => {
			this.dataSource = actuaciones
		})
	}

	modalInsertar(): void {
		const dialogRef = this.dialog.open(ActuacionesModalComponent, {
			width: '23%',
			data: {
				idExpediente: 0,
				responsable: '',
				fecha: new Date(),
				descripcion: '',
				observaciones: '',
				finalizado: false,
			},
		})

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				Swal.showLoading() // Muestra el spinner

				this.actuacionesService
					.postInsertActuacion(
						result.idExpediente,
						result.responsable,
						result.fecha,
						result.descripcion,
						result.observaciones,
						result.finalizado,
					)
					.subscribe((actuacion) => {
						this.dataSource.push(actuacion)
						this.dataSource = [...this.dataSource]

						Swal.hideLoading() // Oculta el spinner
						Swal.fire('Insertado!', 'La actuación ha sido insertada.', 'success') // Muestra un mensaje de éxito
					})
			}
		})
	}
	modalModificar(id: number): void {
		const dialogRef = this.dialog.open(ActuacionesModalComponent, {
			width: '23%',
			data: this.dataSource.find((actuacion) => actuacion.id === id),
		})

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				Swal.showLoading() // Muestra el spinner

				this.actuacionesService
					.putModificarActuacion(
						result.id,
						result.idExpediente,
						result.responsable,
						result.fecha,
						result.descripcion,
						result.observaciones,
						result.finalizado,
					)
					.subscribe((actuacion) => {
						const index = this.dataSource.findIndex((index) => index.id === actuacion.id)

						if (index !== -1) {
							this.dataSource[index] = actuacion
							this.dataSource = [...this.dataSource]

							Swal.hideLoading() // Oculta el spinner
							Swal.fire('Modificado!', 'El expediente ha sido modificado.', 'success') // Muestra un mensaje de éxito
						}
					})
			}
		})
	}

	deleteData(id: number, finalizado: boolean) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: '¿Deseas eliminar o activar esta actuación?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí',
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.showLoading() // Muestra el spinner

				this.actuacionesService.deleteActuacion(id, finalizado).subscribe((actuacion) => {
					const index = this.dataSource.findIndex((index) => index.id === actuacion.id)

					if (index !== -1) {
						this.dataSource[index] = actuacion
						this.dataSource = [...this.dataSource]

						Swal.hideLoading() // Oculta el spinner
						Swal.fire('Eliminado!', 'La actuación ha sido eliminada.', 'success') // Muestra un mensaje de éxito
					}
				})
			}
		})
	}

	estadoBool: string = ''

	applyFilter(): void {
		if (this.estadoBool === '') {
			this.actuacionesService.getAllActuaciones().subscribe((expedientes) => {
				this.dataSource = expedientes
			})
		} else if (this.estadoBool === 'true') {
			this.dataSource = this.dataSource.filter((expediente) => expediente.finalizado === true)
			this.estadoBool = ''
		} else if (this.estadoBool === 'false') {
			this.dataSource = this.dataSource.filter((expediente) => expediente.finalizado === false)
			this.estadoBool = ''
		}
	}
	filtro: string = ''
	filtrarPorNombre(): void {
		if (this.filtro) {
			this.dataSource = this.dataSource.filter((tipoExpediente) =>
				tipoExpediente.responsable.toLowerCase().includes(this.filtro.toLowerCase()),
			)
		} else {
			this.actuacionesService.getAllActuaciones().subscribe((tiposExpediente) => (this.dataSource = tiposExpediente))
		}
	}
}
