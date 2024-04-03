import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TipoExpedienteComponent } from './components/tipo-expediente/tipo-expediente.component'
import { ActuacionesComponent } from './components/actuaciones/actuaciones.component'
import { MenuComponent } from './menu/menu/menu.component'
import { PaginaNoEncontradaComponent } from './components/pagina-no-encontrada/pagina-no-encontrada.component'
import { DocumentosComponent } from './components/documentos/documentos.component'
import { ExpedientesComponent } from './components/expedientes/expedientes.component'

const routes: Routes = [
	{ path: 'expediente', component: ExpedientesComponent },
	{ path: 'tipoExpediente', component: TipoExpedienteComponent },
	{ path: 'actuaciones', component: ActuacionesComponent },
	{ path: 'documentos', component: DocumentosComponent },
	{ path: 'menu', component: MenuComponent },

	{ path: '', redirectTo: '/menu', pathMatch: 'full' }, // Default route
	{ path: '**', component: PaginaNoEncontradaComponent }, // Wildcard route
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
