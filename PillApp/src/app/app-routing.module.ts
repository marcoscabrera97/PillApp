import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListaMedicamentosComponent } from './components/lista-medicamentos/lista-medicamentos.component';
import { CitasComponent } from './components/citas/citas.component';
import { FarmaciasComponent } from './components/farmacias/farmacias.component';
import { InformeComponent } from './components/informe/informe.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { CrearCuentaComponent } from './components/crear-cuenta/crear-cuenta.component';
import { GuardAuthPatientGuard } from './guards/guard-auth-patient.guard';
import { GuardAuthDoctorGuard } from './guards/guard-auth-doctor.guard';
import { GuardAuthGuard } from './guards/guard-auth.guard';
import { HomeDoctorComponent } from './components/home-doctor/home-doctor.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AddMedicinaComponent } from './components/add-medicina/add-medicina.component';


const routes: Routes = [
    { path: 'login', component: IniciarSesionComponent },
    { path: 'register', component: CrearCuentaComponent },
    { path: 'home', component: HomeComponent, canActivate: [GuardAuthPatientGuard] },
    { path: 'addMedicine', component: AddMedicinaComponent, canActivate: [GuardAuthPatientGuard] },
    { path: 'homeDoctor', component: HomeDoctorComponent, canActivate: [GuardAuthDoctorGuard] },
    { path: 'listaMedicamentos', component: ListaMedicamentosComponent, canActivate: [GuardAuthGuard] },
    { path: 'citas', component: CitasComponent, canActivate: [GuardAuthGuard] },
    { path: 'farmacias', component: FarmaciasComponent, canActivate: [GuardAuthGuard] },
    { path: 'informe', component: InformeComponent, canActivate: [GuardAuthGuard] },
    { path: 'logout', component: LogoutComponent },
    { path: '**', component: IniciarSesionComponent }
];

export const APP_ROUTING = RouterModule.forRoot(routes);