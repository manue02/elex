import { TiposExpediente } from '../../models/tipoExpediente.model'
import { TipoExpedienteService } from './../../service/tipoExpediente/tipo-expediente.service'
import { Component, OnInit } from '@angular/core'
import { TipoExpedienteModalComponent } from '../../formulario/tipo-expediente-modal/tipo-expediente-modal.component'
import { MatDialog } from '@angular/material/dialog'

@Component({
	selector: 'app-tipo-expediente',
	templateUrl: './tipo-expediente.component.html',
	styleUrl: './tipo-expediente.component.css',
})
export class TipoExpedienteComponent implements OnInit {
	dataSource: TiposExpediente[] = []
	displayedColumns: string[] = ['id', 'materia', 'acciones', 'activo', 'edit', 'delete']

	constructor(private tipoExpedienteService: TipoExpedienteService, private dialog: MatDialog) {}

	ngOnInit(): void {
		this.tipoExpedienteService.getAllTipoExpediente().subscribe((tiposExpediente) => {
			this.dataSource = tiposExpediente
		})
	}

	modalInsertar(): void {
		const dialogRef = this.dialog.open(TipoExpedienteModalComponent, {
			width: '50%',
			data: { materia: '', acciones: '', activo: true },
		})

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.tipoExpedienteService
					.postInsertTipoExpediente(result.materia, result.acciones, result.activo)
					.subscribe((tipoExpediente) => {
						this.dataSource.push(tipoExpediente)
						this.dataSource = [...this.dataSource]
					})
			}
		})
	}

	deleteData(id: number, activo: boolean) {
		console.log(id, activo)
		this.tipoExpedienteService.deleteTipoExpediente(id, activo).subscribe((tipoExpediente) => {
			const index = this.dataSource.findIndex((tipo) => tipo.id === tipoExpediente.id)
			if (index !== -1) {
				this.dataSource[index] = tipoExpediente
			}
			location.reload()
		})
	}
	modalModificar(id: number): void {
		const dialogRef = this.dialog.open(TipoExpedienteModalComponent, {
			width: '50%',
			data: { materia: '', acciones: '' },
		})

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.tipoExpedienteService
					.editTipoExpediente(id, result.materia, result.acciones)
					.subscribe((tipoExpediente) => {
						const index = this.dataSource.findIndex((tipo) => tipo.id === tipoExpediente.id)
						if (index !== -1) {
							this.dataSource[index] = tipoExpediente
						}
						this.dataSource = [...this.dataSource]
					})
			}
		})
	}
	applyFilter(materiaFiltro: string, activoFiltro: string) {
		let datosFiltrados = this.dataSource.filter((tipo) => {
			return tipo.materia.includes(materiaFiltro) && tipo.activo.toString() === activoFiltro
		})
		this.dataSource = datosFiltrados
	}
}
