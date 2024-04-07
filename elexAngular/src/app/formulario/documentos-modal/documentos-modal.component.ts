import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Documentos } from '../../models/documentos.model'
import { DocumentosService } from './../../service/documentos/documentos.service'
import { FormControl } from '@angular/forms'
import { Observable, of } from 'rxjs'
import { map, startWith, debounceTime } from 'rxjs/operators'
import { Expedientes } from '../../models/expedientes.model'
import { ExpedienteService } from '../../service/expediente/expediente.service'

@Component({
	selector: 'app-documentos-modal',
	templateUrl: './documentos-modal.component.html',
	styleUrl: './documentos-modal.component.css',
})
export class DocumentosModalComponent implements OnInit {
	myControl = new FormControl()
	dataSource: Documentos[] = []
	filteredOptions: Observable<Expedientes[]>
	dataExpediente: Expedientes[] = []
	selectedFile: File | null = null

	constructor(
		public dialogRef: MatDialogRef<DocumentosModalComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			tasa: number
			nombre: string
			tipo: string
			expediente: number
			file: File
		},
		private documentosService: DocumentosService,
		private expedientesService: ExpedienteService,
	) {
		this.filteredOptions = of(this.dataExpediente)
	}

	ngOnInit(): void {
		this.documentosService.getAllDocumentos().subscribe((documentos) => {
			this.dataSource = documentos
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
			this.data.expediente = value
		})
	}

	onNoClick(): void {
		this.dialogRef.close()
	}

	onFileSelected(event: Event): void {
		const target = event.target as HTMLInputElement
		const file: File = (target.files as FileList)[0]
		this.data.file = file
	}

	private _filter(value: string): Expedientes[] {
		const filterValue = typeof value === 'string' ? value.toUpperCase() : ''

		if (!filterValue || filterValue === '') {
			return this.dataExpediente
		}

		return this.dataExpediente.filter((option) => option.codigo.toUpperCase().indexOf(filterValue) === 0)
	}

	logOption(option: any): void {
		console.log(option)
	}

	validarFormulario(): void {
		const idExpediente = this.myControl.value
		const tasa = this.data.tasa
		const nombre = this.data.nombre.trim()
		const tipo = this.data.tipo.trim()

		if (idExpediente === 0 || idExpediente === null || idExpediente === undefined) {
			window.alert('El campo Expediente es obligatorio')
		}

		if (tasa === 0 || tasa === null || tasa === undefined) {
			window.alert('El campo Tasa es obligatorio')
		}

		if (nombre === '') {
			window.alert('El campo Nombre es obligatorio')
		}

		if (tipo === '') {
			window.alert('El campo Tipo es obligatorio')
		}
	}
}
