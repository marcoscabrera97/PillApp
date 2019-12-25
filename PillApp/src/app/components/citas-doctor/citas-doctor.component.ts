import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { DialogOverviewExampleDialog } from '../crear-cuenta/crear-cuenta.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Consulta } from '../home-doctor/consulta.module';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { Router } from '@angular/router';
import { Usuario } from '../crear-cuenta/usuario.module';

@Component({
  selector: 'app-citas-doctor',
  templateUrl: './citas-doctor.component.html',
  styleUrls: ['./citas-doctor.component.scss']
})
export class CitasDoctorComponent implements OnInit {

  public addCitaForm: FormGroup;
  public time: string;
  public addCita: Consulta;
  public patients: Usuario[];
  constructor(private atp: AmazingTimePickerService, private formBuilder: FormBuilder, public dialog: MatDialog, public service: ServiceFirebaseService, private router: Router) { 
    this.time = "   :";
    this.patients = [];
    this.service.getUser().subscribe(users => {
      Object.keys(users).forEach(idUser => {
        if(users[idUser].userType == 'patient'){
          this.patients.push(users[idUser]);
        }
      })
    });
    console.log(this.patients);
    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm(){
    this.addCitaForm = this.formBuilder.group({
      namePatient: ['', Validators.required],
      dateConsulta: ['', Validators.required],
      comentarios: ['', Validators.required],
      paciente: ['', Validators.required]
    });
  }

  open(){
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.time = time;
    });
  }

  saveCita(){
    const addCitaForm = this.addCitaForm.value;
    var formOk = this.checkValueForm(addCitaForm);
    if(formOk){
      console.log(addCitaForm);
      
      this.service.getSpecificUser(this.service.userToken).subscribe(user => {
        this.addCita = new Consulta();
        this.addCita.cip = addCitaForm.paciente;
        this.addCita.fecha = addCitaForm.dateConsulta.toUTCString();
        var auxFecha = new Date(this.addCita.fecha);
        var horaString = this.time.substr(0,2);
        var hora = +horaString;
        
        var minutosString = this.time.substr(3,5);
        var minutos = +minutosString;
        auxFecha.setHours(hora);
        auxFecha.setMinutes(minutos);
        this.addCita.fecha = auxFecha.toUTCString();
        this.addCita.id_hospital = user['id_hospital'];
      
        this.addCita.nombre_doctor = user['name'];
        this.addCita.planta = user['planta'];
        this.addCita.puerta = user['puerta'];
        this.addCita.especialidad = user['especialidad'];
        this.addCita.visitaRealizada = false;
        this.service.addConsulta(this.addCita).subscribe();
        this.router.navigate(['homeDoctor']);
      });
    }else{
      const dialogRef = this.dialog.open(ErrorAddCita, {
        width: '250px'
      });
    }
    this.router.navigate(['homeDoctor']);
  }

  checkValueForm(addCitaForm){
    var formOk = true;
    Object.keys(addCitaForm).forEach(element => {
      if(formOk != false){
        if(element == 'paciente' || element == 'dateConsulta'){
          if(addCitaForm[element] == ''){
            formOk = false;
          }
        }else if(this.time == "   :"){
          formOk = false;
        }
      }
    });
    return formOk;
  }

}

@Component({
  selector: 'error-addCita',
  templateUrl: 'error-addCita.html',
})
export class ErrorAddCita {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
