import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Actuaciones } from '../../models/actuaciones.model'
import { ActuacionesService } from './../../service/actuaciones/actuaciones.service'
import { FormControl } from '@angular/forms'
import { Observable, of } from 'rxjs'
import { map, startWith, debounceTime } from 'rxjs/operators'

@Component({
	selector: 'app-actuaciones-modal',
	templateUrl: './actuaciones-modal.component.html',
	styleUrl: './actuaciones-modal.component.css',
})
export class ActuacionesModalComponent implements OnInit {
	myControl = new FormControl()
	dataSource: Actuaciones[] = []
	filteredOptions: Observable<Actuaciones[]>

	constructor(
		public dialogRef: MatDialogRef<ActuacionesModalComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: { idExpediente: number; responsable: string; fecha: Date; descripcion: string; observaciones: string },
		private actuacionesService: ActuacionesService,
	) {
		this.filteredOptions = of(this.dataSource)
	}
	ngOnInit(): void {
		this.actuacionesService.getAllActuaciones().subscribe((actuaciones) => {
			this.dataSource = actuaciones
		})

		this.filteredOptions = this.myControl.valueChanges.pipe(
			debounceTime(500),
			startWith(''),
			map((value) => this._filter(value)),
			map((options: Actuaciones[]) =>
				options.reduce((unique: Actuaciones[], o: Actuaciones) => {
					if (
						o &&
						o.expediente &&
						!unique.some((obj: Actuaciones) => obj && obj.expediente && obj.expediente.id === o.expediente.id)
					) {
						unique.push(o)
					}
					return unique
				}, []),
			),
		)

		this.myControl.valueChanges.subscribe((value) => {
			this.data.idExpediente = value
		})
	}

	onNoClick(): void {
		this.dialogRef.close()
	}

	private _filter(value: string): Actuaciones[] {
		const filterValue = typeof value === 'string' ? value.toUpperCase() : value

		return this.dataSource.filter((option) => option.expediente.codigo.toUpperCase().indexOf(filterValue) === 0)
	}
}
