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
import { ActuacionesComponent } from './components/actuaciones/actuaciones.component'
import { ActuacionesModalComponent } from './formulario/actuaciones-modal/actuaciones-modal.component'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { ReactiveFormsModule } from '@angular/forms'
import { ExpedientesComponent } from './components/expedientes/expedientes.component'
import { ExpedienteModalComponent } from './formulario/expediente-modal/expediente-modal.component'
import { MatMenuModule } from '@angular/material/menu'
import { PaginaNoEncontradaComponent } from './components/pagina-no-encontrada/pagina-no-encontrada.component'
import { DocumentosModalComponent } from './formulario/documentos-modal/documentos-modal.component'
import { DocumentosComponent } from './components/documentos/documentos.component'
import { DetallesComponent } from './components/detalles/detalles.component'
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component'

@NgModule({
	declarations: [
		AppComponent,
		MenuComponent,
		TipoExpedienteComponent,
		TipoExpedienteModalComponent,
		ActuacionesComponent,
		ActuacionesModalComponent,
		ExpedientesComponent,
		ExpedienteModalComponent,
		PaginaNoEncontradaComponent,
		DocumentosModalComponent,
		DocumentosComponent,
		DetallesComponent,
		LoginComponent,
  HomeComponent,
	],
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
		MatAutocompleteModule,
		ReactiveFormsModule,
		MatMenuModule,
	],
	providers: [provideHttpClient(withFetch()), provideClientHydration(), provideAnimationsAsync()],
	bootstrap: [AppComponent],
})
export class AppModule {}
