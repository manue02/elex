import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Estado } from '../../models/estado.enum'
import { ExpedienteService } from '../../service/expediente/expediente.service'
import { TiposExpediente } from '../../models/tipoExpediente.model'
import { TipoExpedienteService } from './../../service/tipoExpediente/tipo-expediente.service'
import { Expedientes } from '../../models/expedientes.model'
import { FormControl } from '@angular/forms'
import { Observable, of } from 'rxjs'
import { map, startWith, debounceTime } from 'rxjs/operators'

@Component({
	selector: 'app-expediente-modal',
	templateUrl: './expediente-modal.component.html',
	styleUrl: './expediente-modal.component.css',
})
export class ExpedienteModalComponent implements OnInit {
	dataSource: Expedientes[] = []
	dataTipoExpediente: TiposExpediente[] = []
	filteredOptions: Observable<TiposExpediente[]>
	myControl = new FormControl()

	constructor(
		public dialogRef: MatDialogRef<ExpedienteModalComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			id: Number
			idTipoExpediente: Number
			codigo: string
			fecha: Date
			estado: Estado
			opciones: string
			descripcion: string
		},
		private expedienteService: ExpedienteService,
		private tipoExpedienteService: TipoExpedienteService,
	) {
		this.filteredOptions = of(this.dataTipoExpediente)
	}

	ngOnInit(): void {
		this.expedienteService.getAllExpediente().subscribe((expedientes) => {
			this.dataSource = expedientes
		})

		this.tipoExpedienteService.getAllTipoExpediente().subscribe((tiposExpediente) => {
			this.dataTipoExpediente = tiposExpediente
		})

		this.filteredOptions = this.myControl.valueChanges.pipe(
			debounceTime(500),
			startWith(''),
			map((value) => this._filter(value)),
		)

		this.myControl.valueChanges.subscribe((value) => {
			this.data.idTipoExpediente = value
		})
	}

	onNoClick(): void {
		this.dialogRef.close()
	}

	private _filter(value: string): TiposExpediente[] {
		const filterValue = typeof value === 'string' ? value.toUpperCase() : ''

		if (!filterValue) {
			return this.dataTipoExpediente
		}

		return this.dataTipoExpediente.filter((option) => option.materia.toUpperCase().indexOf(filterValue) === 0)
	}
}
