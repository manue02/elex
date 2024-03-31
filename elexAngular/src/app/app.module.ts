import { NgModule } from '@angular/core'
import { BrowserModule, provideClientHydration } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { MenuComponent } from './menu/menu/menu.component'
import { TipoExpedienteComponent } from './components/tipo-expediente/tipo-expediente.component'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { provideHttpClient, withFetch } from '@angular/common/http'
import { MatTableModule } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { TipoExpedienteModalComponent } from './formulario/tipo-expediente-modal/tipo-expediente-modal.component'
import { FormsModule } from '@angular/forms'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSelectModule } from '@angular/material/select'

@NgModule({
	declarations: [AppComponent, MenuComponent, TipoExpedienteComponent, TipoExpedienteModalComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		MatSlideToggleModule,
		HttpClientModule,
		MatTableModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatDialogModule,
		MatSelectModule,
	],
	providers: [provideHttpClient(withFetch()), provideClientHydration(), provideAnimationsAsync()],
	bootstrap: [AppComponent],
})
export class AppModule {}
