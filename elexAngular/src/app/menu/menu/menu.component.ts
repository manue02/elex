import { Component } from '@angular/core'
import { LoginService } from './../../service/login/login.service'
import { Router } from '@angular/router'

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrl: './menu.component.css',
})
export class MenuComponent {
	constructor(private loginService: LoginService, private router: Router) {}

	logout(): void {
		this.loginService.logout()
		this.router.navigate(['/login'])
	}
}
