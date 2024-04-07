import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
	selector: 'app-tipo-expediente-modal',
	templateUrl: './tipo-expediente-modal.component.html',
	styleUrl: './tipo-expediente-modal.component.css',
})
export class TipoExpedienteModalComponent {
	constructor(
		public dialogRef: MatDialogRef<TipoExpedienteModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { materia: string; acciones: string },
	) {}

	onNoClick(): void {
		this.dialogRef.close()
	}

	validarFormulario(): void {
		const materia = this.data.materia
		const acciones = this.data.acciones

		if (materia === '') {
			alert('El campo materia no puede estar vacío')
		}

		if (acciones === '') {
			alert('El campo acciones no puede estar vacío')
		}
	}
}
