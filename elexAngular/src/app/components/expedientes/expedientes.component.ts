import { Component, OnInit } from '@angular/core'
import { Expedientes } from '../../models/expedientes.model'
import { ExpedienteService } from '../../service/expediente/expediente.service'
import { MatDialog } from '@angular/material/dialog'
import { ExpedienteModalComponent } from '../../formulario/expediente-modal/expediente-modal.component'
import { Estado } from '../../models/estado.enum'
import Swal from 'sweetalert2'

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
	]

	constructor(private ExpedienteService: ExpedienteService, private dialog: MatDialog) {}

	ngOnInit(): void {
		this.ExpedienteService.getAllExpediente().subscribe((expedientes) => {
			this.dataSource = expedientes
		})
	}

	applyFilter(): void {}
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
				).subscribe((expediente) => {
					this.dataSource.push(expediente)
					this.dataSource = [...this.dataSource]

					Swal.hideLoading() // Oculta el spinner
					Swal.fire('Insertado!', 'El expediente ha sido insertado.', 'success') // Muestra un mensaje de éxito
				})
			}
		})
	}
	modalModificar(id: String): void {
		const dialogRef = this.dialog.open(ExpedienteModalComponent, {
			width: '23%',
			data: this.dataSource.find((expediente) => expediente.codigo === id),
		})

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				Swal.showLoading() // Muestra el spinner

				this.ExpedienteService.putModificarExpediente(
					result.idTipoExpediente,
					result.codigo,
					result.fecha,
					result.estado,
					result.opciones,
					result.descripcion,
				).subscribe((expediente) => {
					const index = this.dataSource.findIndex((expediente) => expediente.codigo === id)
					this.dataSource[index] = expediente
					this.dataSource = [...this.dataSource]

					Swal.hideLoading() // Oculta el spinner
					Swal.fire('Modificado!', 'El expediente ha sido modificado.', 'success') // Muestra un mensaje de éxito
				})
			}
		})
	}
}
