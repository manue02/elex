import { Component, OnInit } from '@angular/core'
import { Actuaciones } from '../../models/actuaciones.model'
import { ActuacionesService } from './../../service/actuaciones/actuaciones.service'
import { MatDialog } from '@angular/material/dialog'
import { ActuacionesModalComponent } from '../../formulario/actuaciones-modal/actuaciones-modal.component'

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
						}
					})
			}
		})
	}

	deleteData(id: number, finalizado: boolean) {
		this.actuacionesService.deleteActuacion(id, finalizado).subscribe((actuacion) => {
			const index = this.dataSource.findIndex((index) => index.id === actuacion.id)

			if (index !== -1) {
				this.dataSource[index] = actuacion
				this.dataSource = [...this.dataSource]
			}
		})
	}

	applyFilter(): void {}
}
