import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_ROUTING } from './app-routing.module';



import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ListaMedicamentosComponent } from './components/lista-medicamentos/lista-medicamentos.component';
import { CitasComponent } from './components/citas/citas.component';
import { FarmaciasComponent } from './components/farmacias/farmacias.component';
import { InformeComponent } from './components/informe/informe.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CrearCuentaComponent, DialogOverviewExampleDialog, DialogErrorRegistration } from './components/crear-cuenta/crear-cuenta.component';
import {MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';




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
    DialogErrorRegistration
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    APP_ROUTING,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
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
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogOverviewExampleDialog,
    DialogErrorRegistration
  ]
})
export class AppModule { }
