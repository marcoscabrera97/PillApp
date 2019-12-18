import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { DialogOverviewExampleDialog } from '../crear-cuenta/crear-cuenta.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Consulta } from '../home-doctor/consulta.module';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-citas-doctor',
  templateUrl: './citas-doctor.component.html',
  styleUrls: ['./citas-doctor.component.scss']
})
export class CitasDoctorComponent implements OnInit {

  public addCitaForm: FormGroup;
  public time: string;
  public addCita: Consulta;
  constructor(private atp: AmazingTimePickerService, private formBuilder: FormBuilder, public dialog: MatDialog, public service: ServiceFirebaseService, private router: Router) { 
    this.time = "   :";
    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm(){
    this.addCitaForm = this.formBuilder.group({
      namePatient: ['', Validators.required],
      dateConsulta: ['', Validators.required],
      comentarios: ['', Validators.required]
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
      this.addCita = new Consulta();
      this.addCita.nombrePaciente = addCitaForm.namePatient;
      this.addCita.horaConsulta = addCitaForm.dateConsulta;
      this.addCita.horaConsulta = this.time;
      this.addCita.visitaRealizada = false;
      this.addCita.comentario = addCitaForm.comentarios;
      this.service.addConsulta(this.addCita).subscribe();
      this.router.navigate(['homeDoctor']);
    }else{
      const dialogRef = this.dialog.open(ErrorAddCita, {
        width: '250px'
      });
    }
  }

  checkValueForm(addCitaForm){
    var formOk = true;
    Object.keys(addCitaForm).forEach(element => {
      if(formOk != false){
        if(element == 'namePatient' || element == 'dateConsulta'){
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
