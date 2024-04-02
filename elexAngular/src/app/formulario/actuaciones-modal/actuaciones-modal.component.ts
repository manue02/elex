import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Actuaciones } from '../../models/actuaciones.model'
import { ActuacionesService } from './../../service/actuaciones/actuaciones.service'
import { FormControl } from '@angular/forms'
import { Observable, of } from 'rxjs'
import { map, startWith, debounceTime } from 'rxjs/operators'
import { Expedientes } from '../../models/expedientes.model'
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
		public data: { idExpediente: number; responsable: string; fecha: Date; descripcion: string; observaciones: string },
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
		const filterValue = typeof value === 'string' ? value.toUpperCase() : value

		return this.dataExpediente.filter((option) => option.codigo.toUpperCase().indexOf(filterValue) === 0)
	}
}
