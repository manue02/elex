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
				).subscribe((expediente) => {
					const index = this.dataSource.findIndex((expediente) => expediente.id === id)
					this.dataSource[index] = expediente
					this.dataSource = [...this.dataSource]

					Swal.hideLoading() // Oculta el spinner
					Swal.fire('Modificado!', 'El expediente ha sido modificado.', 'success') // Muestra un mensaje de éxito
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
