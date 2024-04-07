import { LoginService } from './../../service/login/login.service'
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
	constructor(private router: Router, private loginService: LoginService) {}

	ngOnInit() {}

	onSubmit(): void {
		const succes = this.loginService.login(this.email, this.password)

		if (succes) {
			this.router.navigate(['/home'])
		} else {
			alert('Usuario o contraseña incorrectos')
		}
	}
}
