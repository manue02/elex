import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
	email = ''
	password = ''
	constructor(private router: Router) {}

	ngOnInit() {}

	onSubmit(): void {
		if (this.email === 'soltel' && this.password === 'admin') {
			// redirigir a la página de inicio
			this.router.navigate(['/home'])
		}
	}
}
