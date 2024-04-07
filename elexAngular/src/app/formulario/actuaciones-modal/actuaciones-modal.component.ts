import { Expedientes } from './../../models/expedientes.model'
import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Actuaciones } from '../../models/actuaciones.model'
import { ActuacionesService } from './../../service/actuaciones/actuaciones.service'
import { FormControl } from '@angular/forms'
import { Observable, of } from 'rxjs'
import { map, startWith, debounceTime } from 'rxjs/operators'
import { ExpedienteService } from '../../service/expediente/expediente.service'

@Component({
	selector: 'app-actuaciones-modal',
	templateUrl: './actuaciones-modal.component.html',
	styleUrl: './actuaciones-modal.component.css',
})
export class ActuacionesModalComponent implements OnInit {
	myControl = new FormControl()
	dataSource: Actuaciones[] = []
	filteredOptions: Observable<Expedientes[]>
	dataExpediente: Expedientes[] = []

	constructor(
		public dialogRef: MatDialogRef<ActuacionesModalComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			idExpediente: number
			responsable: string
			fecha: Date
			descripcion: string
			observaciones: string
		},
		private actuacionesService: ActuacionesService,
		private expedientesService: ExpedienteService,
	) {
		this.filteredOptions = of(this.dataExpediente)
	}
	ngOnInit(): void {
		this.actuacionesService.getAllActuaciones().subscribe((actuaciones) => {
			this.dataSource = actuaciones
		})

		this.expedientesService.getAllExpediente().subscribe((expedientes) => {
			this.dataExpediente = expedientes
		})

		this.filteredOptions = this.myControl.valueChanges.pipe(
			debounceTime(500),
			startWith(''),
			map((value) => this._filter(value)),
		)

		this.myControl.valueChanges.subscribe((value) => {
			this.data.idExpediente = value
		})
	}

	onNoClick(): void {
		this.dialogRef.close()
	}

	private _filter(value: string): Expedientes[] {
		const filterValue = typeof value === 'string' ? value.toUpperCase() : ''

		if (!filterValue) {
			return this.dataExpediente
		}

		return this.dataExpediente.filter((option) => option.codigo.toUpperCase().indexOf(filterValue) === 0)
	}

	validarFormulario(): void {
		const partes = this.data.responsable.trim().split(' ')
		const Expediente = this.data.idExpediente
		const fecha = this.data.fecha
		const descripcion = this.data.descripcion.trim()
		const observaciones = this.data.observaciones.trim()

		if (partes.length < 3) {
			window.alert('El campo Responsable debe contener un nombre y dos apellidos')
		}

		if (Expediente === 0 || Expediente === null || Expediente === undefined) {
			window.alert('El campo Expediente es obligatorio')
		}

		if (fecha === null || fecha === undefined) {
			window.alert('El campo Fecha es obligatorio')
		}

		if (descripcion === '') {
			window.alert('El campo Descripción es obligatorio')
		}

		if (observaciones === '') {
			window.alert('El campo Observaciones es obligatorio')
		}
	}
}
