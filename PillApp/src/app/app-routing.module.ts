import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListaMedicamentosComponent } from './components/lista-medicamentos/lista-medicamentos.component';
import { CitasComponent } from './components/citas/citas.component';
import { FarmaciasComponent } from './components/farmacias/farmacias.component';
import { InformeComponent } from './components/informe/informe.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';

const routes: Routes = [
    { path: 'iniciar_sesion', component: IniciarSesionComponent },
    { path: 'home', component: HomeComponent},
    { path: 'listaMedicamentos', component: ListaMedicamentosComponent},
    { path: 'citas', component: CitasComponent},
    { path: 'farmacias', component: FarmaciasComponent},
    { path: 'informe', component: InformeComponent},
    { path: '**', component: IniciarSesionComponent }
];

export const APP_ROUTING = RouterModule.forRoot(routes);