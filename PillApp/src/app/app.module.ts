import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_ROUTING } from './app-routing.module';



import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent, DeleteRecordatory, DeleteRecordatoryOk, LoadRecordatories } from './components/home/home.component';
import { ListaMedicamentosComponent, EditQuantityMedicine } from './components/lista-medicamentos/lista-medicamentos.component';
import { CitasComponent } from './components/citas/citas.component';
import { FarmaciasComponent } from './components/farmacias/farmacias.component';
import { InformeComponent } from './components/informe/informe.component';
import { IniciarSesionComponent, DialogFailSignIn } from './components/iniciar-sesion/iniciar-sesion.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatFormFieldControl } from '@angular/material/form-field';
import { MatInputModule, MatSelectModule, MatNativeDateModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CrearCuentaComponent, DialogOverviewExampleDialog, DialogErrorRegistration, DialogOkRegistration, DialogUserExistent, DialogMailExistent, DialogEmptyParameter, DialogCipExistent } from './components/crear-cuenta/crear-cuenta.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ServiceFirebaseService } from './services/service-firebase.service';
import { environment } from 'src/environments/environment.prod';
import { HomeDoctorComponent } from './components/home-doctor/home-doctor.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AddMedicinaComponent, ErrorAddMedicine } from './components/add-medicina/add-medicina.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { MessagingService } from './services/messaging.service';
import { EditMedicineComponent } from './components/edit-medicine/edit-medicine.component';
import { DetallesCitaComponent } from './components/detalles-cita/detalles-cita.component';
import { AgmCoreModule } from '@agm/core';
import { CitasDoctorComponent, ErrorAddCita } from './components/citas-doctor/citas-doctor.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SearchInformeComponent } from './components/search-informe/search-informe.component';
import { NewMedicineComponent, MedicineExist, EmptyParameters } from './components/new-medicine/new-medicine.component';






@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ListaMedicamentosComponent,
    CitasComponent,
    FarmaciasComponent,
    InformeComponent,
    IniciarSesionComponent,
    CrearCuentaComponent,
    AppComponent,
    DialogOverviewExampleDialog,
    LoadRecordatories,
    EmptyParameters,
    MedicineExist,
    DialogErrorRegistration,
    DialogOkRegistration,
    DialogFailSignIn,
    EditQuantityMedicine,
    HomeDoctorComponent,
    LogoutComponent,
    AddMedicinaComponent,
    DialogUserExistent,
    DialogMailExistent,
    DialogEmptyParameter,
    EditMedicineComponent,
    DeleteRecordatory,
    DeleteRecordatoryOk,
    DetallesCitaComponent,
    ErrorAddMedicine,
    CitasDoctorComponent,
    ErrorAddCita,
    SearchInformeComponent,
    NewMedicineComponent,
    DialogCipExistent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    APP_ROUTING,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    CommonModule,
    AngularFireDatabaseModule,
    AngularFireMessagingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    AmazingTimePickerModule,
    MatSidenavModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBtI_hiSMu6pcJcsvryBFa7jfS5dLR_bD4'
    }),
    MatAutocompleteModule
  ],
  providers: [
    ServiceFirebaseService,
    MatDatepickerModule,
    MessagingService,
    AsyncPipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogOverviewExampleDialog,
    EmptyParameters,
    MedicineExist,
    EditQuantityMedicine,
    DialogErrorRegistration,
    DialogOkRegistration,
    DialogFailSignIn,
    DialogUserExistent,
    DialogMailExistent,
    DialogEmptyParameter,
    DeleteRecordatory,
    DeleteRecordatoryOk,
    ErrorAddMedicine,
    ErrorAddCita,
    LoadRecordatories,
    DialogCipExistent
  ]
})
export class AppModule { }
