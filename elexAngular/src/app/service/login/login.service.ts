import { Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})
export class LoginService {
	constructor() {}

	login(username: string, password: string): boolean {
		// Verifica si el nombre de usuario y la contraseña son correctos
		if (username === 'soltel' && password === 'admin') {
			// Si son correctos, guarda el nombre de usuario en el almacenamiento de la sesión
			sessionStorage.setItem('username', username)
			return true
		} else {
			return false
		}
	}

	logout(): void {
		// Elimina el nombre de usuario del almacenamiento de la sesión
		sessionStorage.removeItem('username')
	}

	isAuthenticated(): boolean {
		// Verifica si el usuario está autenticado comprobando si el nombre de usuario existe en el almacenamiento de la sesión
		const username = sessionStorage.getItem('username')
		return username !== null
	}
}
