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

	//	Metodo que se ejecuta al iniciar el componente
	//	Se llama del servicio la funcion getAllTipoExpediente para obtener todos los tipos de expediente
	//	y al obtener todos los tipos de expediente se almacenan en el dataSource

	ngOnInit(): void {
		this.tipoExpedienteService.getAllTipoExpediente().subscribe((tiposExpediente) => {
			this.dataSource = tiposExpediente
		})
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
				this.tipoExpedienteService
					.postInsertTipoExpediente(result.materia, result.acciones, result.activo)
					.subscribe((tipoExpediente) => {
						this.dataSource.push(tipoExpediente)
						this.dataSource = [...this.dataSource]
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
		this.tipoExpedienteService.deleteTipoExpediente(id, activo).subscribe((tipoExpediente) => {
			const index = this.dataSource.findIndex((tipo) => tipo.id === tipoExpediente.id)
			
			if (index !== -1) {
				this.dataSource[index] = tipoExpediente
				this.dataSource = [...this.dataSource]
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
				this.tipoExpedienteService
					.editTipoExpediente(requestId, result.materia, result.acciones)
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

	//	Metodo que se le pasa por parametro la materia y el activo para filtrar los tipos de expediente
	//	Aun en construccion

	applyFilter(materiaFiltro: string, activoFiltro: string) {
		// Convertir la primera letra a mayúscula y el resto a minúsculas
		materiaFiltro = materiaFiltro ? materiaFiltro.charAt(0).toUpperCase() + materiaFiltro.slice(1).toLowerCase() : ''

		let datosFiltrados = this.dataSource.filter((tipo) => {
			let filtroMateria = materiaFiltro !== '' ? tipo.materia.includes(materiaFiltro) : true
			let filtroActivo =
				activoFiltro !== undefined && activoFiltro !== '' ? tipo.activo.toString() === activoFiltro : true
			return filtroMateria && filtroActivo
		})

		// Si materiaFiltro está vacío, mostrar todos los datos
		this.dataSource = materiaFiltro !== '' ? datosFiltrados : this.dataSource
	}
}
