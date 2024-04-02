import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'

@Component({
	selector: 'app-pagina-no-encontrada',
	templateUrl: './pagina-no-encontrada.component.html',
	styleUrl: './pagina-no-encontrada.component.css',
})
export class PaginaNoEncontradaComponent implements OnInit {
	constructor(private location: Location) {}

	ngOnInit() {}
	goBack(): void {
		this.location.back()
	}
}
