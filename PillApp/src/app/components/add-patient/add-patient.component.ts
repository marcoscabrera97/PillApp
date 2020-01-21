import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Usuario } from '../crear-cuenta/usuario.module';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss']
})
export class AddPatientComponent implements OnInit {

  public addPatientForm: FormGroup;
  public userModule: Usuario;
  private regiterNotOk: boolean;
  private emptyParameter: boolean;


  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private service: ServiceFirebaseService, private router: Router) { 
    this.buildForm();
  }

  ngOnInit() {
  }

  private buildForm() {
    this.addPatientForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
      cip: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  checkName(name) {
    var hasNumber = /\d/;
    return hasNumber.test(name);
  }

  checkUsername(username) {
    var hasNumber = /\d/;
    return !hasNumber.test(username);
  }

  throwErrorMessagePasswords() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogAddPatient, {
      width: '250px'
    });
  }

  throwFailRegisterDialog() {
    const dialogRef = this.dialog.open(DialogErrorRegistrationAddPatient, {
      width: '250px'
    });
  }

  throwOkDialog() {
    const dialogRef = this.dialog.open(DialogOkRegistrationAddPatient, {
      width: '250px'
    });
    this.router.navigate(['homeDoctor']);
  }

  throwEqualUserNameDialog() {
    const dialogRef = this.dialog.open(DialogUserExistentAddPatient, {
      width: '250px'
    });
  }

  throwEqualMailDialog() {
    const dialogRef = this.dialog.open(DialogMailExistentAddPatient, {
      width: '250px'
    });
  }

  throwEqualCipDialog(){
    const dialogRef = this.dialog.open(DialogCipExistentAddPatient, {
      width: '250px'
    });
  }

  throwEmptyParameter(){
    const dialogRef = this.dialog.open(DialogEmptyParameterAddPatient, {
      width: '250px'
    });
  }

  checkUserExist(users, idToken){
    console.log(users[idToken].cip);
    if(this.userModule.username == users[idToken].username) {
      this.throwEqualUserNameDialog();
      return true;
    }else if(this.userModule.email == users[idToken].email) {
      this.throwEqualMailDialog();
      return true;
    }else if(this.userModule.cip == users[idToken].cip){
      this.throwEqualCipDialog();
      return true;
    }
    return false;
  }

  register() {
    this.userModule = new Usuario();
    var notEqualPasswords = false;
    var registerFail = false;

    const userRegister = this.addPatientForm.value;
    this.userModule.name = userRegister.name;
    this.userModule.surname = userRegister.surname;
    this.userModule.username = userRegister.username;
    this.userModule.password = userRegister.password1;
    this.userModule.email = userRegister.email;
    this.userModule.cip = userRegister.cip;
    this.userModule.userType = 'patient';
    registerFail = this.checkName(this.userModule.name);
    if(!registerFail){
      registerFail = this.checkName(this.userModule.surname);
    }
    if(!registerFail){
      registerFail = this.checkUsername(this.userModule.username);
    }

    var password1 = this.addPatientForm.controls.password1.value;
    var password2 = this.addPatientForm.controls.password2.value;

    if(password1 != password2) {
      notEqualPasswords = true;
    }
    if(registerFail) {
      this.throwFailRegisterDialog();
    }else if(notEqualPasswords) {
      this.throwErrorMessagePasswords();
    }else if(!this.regiterNotOk){
      Object.keys(this.userModule).forEach( value => {
        if((this.userModule[value] == undefined || this.userModule[value] == '') && !this.emptyParameter){
          this.emptyParameter = true;
        }
      });
      if(this.emptyParameter){
        this.throwEmptyParameter();
        this.emptyParameter = false;
      }else{
        this.service.getUser().subscribe(users => {
          var userExists;
          if(users != null){
            Object.keys(users).forEach( idToken => {
              if(!userExists) {
                userExists = this.checkUserExist(users, idToken);
              }
            });
          }
          if(!userExists){
            this.service.addUser(this.userModule).subscribe(resp => {
              this.throwOkDialog();
            });
          }
        });
      }
    }
  }
}

@Component({
  selector: 'dialog-error-passwords',
  templateUrl: '../crear-cuenta/dialog-error-passwords.html',
})
export class DialogOverviewExampleDialogAddPatient {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogAddPatient>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-fail-registration',
  templateUrl: '../crear-cuenta/dialog-fail-registration.html',
})
export class DialogErrorRegistrationAddPatient {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogAddPatient>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-ok-registration',
  templateUrl: '../crear-cuenta/dialog-ok-registration.html',
})
export class DialogOkRegistrationAddPatient {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogAddPatient>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-user-existent',
  templateUrl: '../crear-cuenta/dialog-user-existent.html',
})
export class DialogUserExistentAddPatient {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogAddPatient>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'dialog-mail-existent',
  templateUrl: '../crear-cuenta/dialog-mail-existent.html',
})
export class DialogMailExistentAddPatient {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogAddPatient>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-empty-parameter',
  templateUrl: '../crear-cuenta/dialog-empty-parameter.html',
})
export class DialogEmptyParameterAddPatient {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogAddPatient>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-cip-existent',
  templateUrl: '../crear-cuenta/dialog-cip-existent.html',
})
export class DialogCipExistentAddPatient {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogAddPatient>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
