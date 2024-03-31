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
		@Inject(MAT_DIALOG_DATA) public data: { id: number; materia: string; acciones: string; activo: boolean },
	) {}

	onNoClick(): void {
		this.dialogRef.close()
	}
}
