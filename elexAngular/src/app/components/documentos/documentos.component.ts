import { Component, OnInit } from '@angular/core'
import { Documentos } from '../../models/documentos.model'
import { DocumentosService } from './../../service/documentos/documentos.service'
import { MatDialog } from '@angular/material/dialog'
import { DocumentosModalComponent } from '../../formulario/documentos-modal/documentos-modal.component'
import Swal from 'sweetalert2'
import { LoginService } from './../../service/login/login.service'
import { Router } from '@angular/router'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs'

@Component({
	selector: 'app-documentos',
	templateUrl: './documentos.component.html',
	styleUrl: './documentos.component.css',
})
export class DocumentosComponent implements OnInit {
	dataSource: Documentos[] = []
	displayedColumns: string[] = ['id', 'tasa', 'vigente', 'nombre', 'tipo', 'expdiente', 'BLOB', 'edit', 'delete']

	constructor(
		private documentosService: DocumentosService,
		private dialog: MatDialog,
		private loginService: LoginService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.documentosService.getAllDocumentos().subscribe((documentos) => {
			this.dataSource = documentos
			this.dataSourceOriginal = documentos
		})

		if (!this.loginService.isAuthenticated()) {
			// Si el usuario no está autenticado, muestra un mensaje y luego redirige a la página de inicio de sesión
			window.alert('Redirigiendo a login, no estás autenticado')
			this.router.navigate(['/login'])
		}
	}

	modalInsertar(): void {
		const dialogRef = this.dialog.open(DocumentosModalComponent, {
			width: '23%',
			data: {
				tasa: 0,
				vigente: true,
				nombre: '',
				tipo: '',
				expediente: 0,
				botonArchivo: true,
			},
		})

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				Swal.showLoading() // Muestra el spinner

				this.documentosService
					.postInsertDocumentos(result.file, result.tasa, result.vigente, result.nombre, result.tipo, result.expediente)
					.pipe(
						catchError((error) => {
							Swal.hideLoading() // Oculta el spinner
							Swal.fire('Error!', 'Ha ocurrido un error al insertar el documento.', 'error') // Muestra un mensaje de error
							return of(null)
						}),
					)
					.subscribe((documento) => {
						if (documento) {
							this.dataSource.push(documento)
							this.dataSource = [...this.dataSource]

							Swal.hideLoading() // Oculta el spinner
							Swal.fire('Insertado!', 'El documento ha sido insertado.', 'success') // Muestra un mensaje de éxito
						}
					})
			}
		})
	}

	modalModificar(id: number): void {
		const dialogRef = this.dialog.open(DocumentosModalComponent, {
			width: '23%',
			data: this.dataSource.find((documento) => documento.id === id),
		})

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				Swal.showLoading() // Muestra el spinner

				this.documentosService
					.putModificarDocumentos(result.id, result.tasa, result.nombre, result.tipo, result.expediente)
					.pipe(
						catchError((error) => {
							Swal.hideLoading() // Oculta el spinner
							Swal.fire('Error!', 'Ha ocurrido un error al modificar el documento.', 'error') // Muestra un mensaje de error
							return of(null)
						}),
					)
					.subscribe((documento) => {
						if (documento) {
							const index = this.dataSource.findIndex((documento) => documento.id === id)

							if (index !== -1) {
								this.dataSource[index] = documento
								this.dataSource = [...this.dataSource]

								Swal.hideLoading() // Oculta el spinner
								Swal.fire('Modificado!', 'El documento ha sido modificado.', 'success') // Muestra un mensaje de éxito
							}
						}
					})
			}
		})
	}

	deleteData(id: number, vigente: boolean): void {
		Swal.fire({
			title: '¿Estás seguro?',
			text: '¿Deseas eliminar o activar este documento?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí',
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.showLoading() // Muestra el spinner

				this.documentosService.deleteDocumentos(id, vigente).subscribe((documento) => {
					const index = this.dataSource.findIndex((doc) => doc.id === id)

					if (index !== -1) {
						this.dataSource[index] = documento
						this.dataSource = [...this.dataSource]

						Swal.hideLoading() // Oculta el spinner
						Swal.fire('Eliminado!', 'El documento ha sido eliminado.', 'success') // Muestra un mensaje de éxito
					}
				})
			}
		})
	}

	descargarBlob(id: number): void {
		this.documentosService.descargarBlob(id).subscribe((blob) => {
			const url = window.URL.createObjectURL(blob)
			window.open(url)
		})
	}

	descargarArchivo(nombre: String): void {
		this.documentosService.descargarArchivo(nombre).subscribe((file) => {
			const url = window.URL.createObjectURL(file)
			window.open(url)
		})
	}

	filtro: string = ''
	filtrarPorNombre(): void {
		if (this.filtro) {
			this.dataSource = this.dataSource.filter((tipoExpediente) =>
				tipoExpediente.nombre.toLowerCase().includes(this.filtro.toLowerCase()),
			)
		} else {
			this.documentosService.getAllDocumentos().subscribe((tiposExpediente) => (this.dataSource = tiposExpediente))
		}
	}

	estadoBool: string = ''
	dataSourceOriginal: Documentos[] = []

	applyFilter(): void {
		if (this.estadoBool === '') {
			this.documentosService.getAllDocumentos().subscribe((expedientes) => {
				this.dataSource = expedientes
				this.dataSourceOriginal = expedientes
			})
		} else if (this.estadoBool === 'true') {
			this.dataSource = this.dataSourceOriginal.filter((expediente) => expediente.vigente === true)
		} else if (this.estadoBool === 'false') {
			this.dataSource = this.dataSourceOriginal.filter((expediente) => expediente.vigente === false)
		}
	}
}
