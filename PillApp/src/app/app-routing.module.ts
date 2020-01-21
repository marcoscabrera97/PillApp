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
import { EditMedicineComponent } from './components/edit-medicine/edit-medicine.component';
import { DetallesCitaComponent } from './components/detalles-cita/detalles-cita.component';
import { CitasDoctorComponent } from './components/citas-doctor/citas-doctor.component';
import { SearchInformeComponent } from './components/search-informe/search-informe.component';
import { NewMedicineComponent } from './components/new-medicine/new-medicine.component';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { GuardAuthAdminGuard } from './guards/guard-auth-admin.guard';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { AddPatientComponent } from './components/add-patient/add-patient.component';


const routes: Routes = [
    { path: 'login', component: IniciarSesionComponent },
    { path: 'register', component: CrearCuentaComponent },
    { path: 'home', component: HomeComponent, canActivate: [GuardAuthPatientGuard] },
    { path: 'addMedicine', component: AddMedicinaComponent, canActivate: [GuardAuthPatientGuard] },
    { path: 'newMedicine', component: NewMedicineComponent, canActivate: [GuardAuthPatientGuard] },
    { path: 'editMedicine/:id', component: EditMedicineComponent, canActivate: [GuardAuthPatientGuard] },
    { path: 'homeDoctor', component: HomeDoctorComponent, canActivate: [GuardAuthDoctorGuard] },
    { path: 'homeAdmin', component: HomeAdminComponent, canActivate: [GuardAuthAdminGuard] },
    { path: 'editUser/:id', component: EditUserComponent },
    { path: 'buscarInforme', component: SearchInformeComponent, canActivate: [GuardAuthDoctorGuard] },
    { path: 'addPatient', component: AddPatientComponent, canActivate: [GuardAuthDoctorGuard] },
    { path: 'listaMedicamentos', component: ListaMedicamentosComponent, canActivate: [GuardAuthPatientGuard] },
    { path: 'verMas/:idDate', component: DetallesCitaComponent, canActivate: [GuardAuthPatientGuard] },
    { path: 'citas', component: CitasComponent, canActivate: [GuardAuthPatientGuard] },
    { path: 'citasDoctor', component: CitasDoctorComponent, canActivate: [GuardAuthDoctorGuard] },
    { path: 'farmacias', component: FarmaciasComponent, canActivate: [GuardAuthPatientGuard] },
    { path: 'informe', component: InformeComponent, canActivate: [GuardAuthPatientGuard] },
    { path: 'logout', component: LogoutComponent },
    { path: '**', component: IniciarSesionComponent }
];

export const APP_ROUTING = RouterModule.forRoot(routes);