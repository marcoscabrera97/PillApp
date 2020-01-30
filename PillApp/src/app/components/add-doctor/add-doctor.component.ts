import { Component, OnInit } from '@angular/core';
import { ServiceFirebaseService } from '../../services/service-firebase.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogOverviewExampleDialog, DialogEmptyParameter, DialogMailExistent, DialogOkRegistration, DialogUserExistent } from '../crear-cuenta/crear-cuenta.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss']
})
export class AddDoctorComponent implements OnInit {

  public hospitals;
  public addDoctor;

  constructor(private service: ServiceFirebaseService, private formBuilder: FormBuilder, private dialog: MatDialog, private router: Router) {
    this.getHospitals();
    this.buildForm();
  }

  ngOnInit() {
  }

  getHospitals(){
    this.hospitals = new Array();
    this.service.getHospitals().subscribe(hospitals => {
      Object.keys(hospitals).forEach(hospital => {
        hospitals[hospital]['id'] = hospital;
        this.hospitals.push(hospitals[hospital]);
      })
    })
  }

  displayFn(hospital?): string | undefined {    
    return hospital ? hospital['nombre_hosp'] : undefined;
  }

  buildForm(){
    this.addDoctor = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      especialidad: ['', Validators.required],
      id_hospital: ['', Validators.required],
      planta: ['', Validators.required],
      puerta: ['', Validators.required],
      password: ['', Validators.required],
      password1: ['', Validators.required],
      userType: ['doctor']
    });
  }

  throwErrorMessagePasswords() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px'
    });
  }

  throwEmptyParameter(){
    const dialogRef = this.dialog.open(DialogEmptyParameter, {
      width: '250px'
    });
  }

  throwOkDialog() {
    const dialogRef = this.dialog.open(DialogOkRegistration, {
      width: '250px'
    });
    this.router.navigate(['homeAdmin']);
  }

  throwEqualUserNameDialog() {
    const dialogRef = this.dialog.open(DialogUserExistent, {
      width: '250px'
    });
  }

  throwEqualMailDialog() {
    const dialogRef = this.dialog.open(DialogMailExistent, {
      width: '250px'
    });
  }

  checkUserExist(addDoctorForm, users, idToken){
    if(addDoctorForm.username == users[idToken].username) {
      this.throwEqualUserNameDialog();
      return true;
    }else if(addDoctorForm.email == users[idToken].email) {
      this.throwEqualMailDialog();
      return true;
    }
    return false;
  }

  addDoctorFunction(){
    const addDoctor = this.addDoctor.value;
    var emptyInput = false;
    var wrongPassword = false;
    for(var input in addDoctor){
      if((addDoctor[input] == "" || addDoctor[input] == null) && !emptyInput){
        emptyInput = true;
      }
    }
    if(addDoctor['password'] != addDoctor['password1']){
      this.throwErrorMessagePasswords();
      wrongPassword = true;
    }
    if(emptyInput){
      this.throwEmptyParameter();
    }else if(!wrongPassword){
      this.service.getUser().subscribe(users => {
        var userExists;
        if(users != null){
          Object.keys(users).forEach( idToken => {
            if(!userExists) {
              userExists = this.checkUserExist(addDoctor, users, idToken);
            }
          });
        }
        if(!userExists){
          delete addDoctor.password1;
          addDoctor['id_hospital'] = addDoctor.id_hospital['id'];
          this.service.addUser(addDoctor).subscribe(resp => {
            this.throwOkDialog();
          });
        }
      });
    }
  }

}
