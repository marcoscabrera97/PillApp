import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from './usuario.module';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.scss']
})
export class CrearCuentaComponent implements OnInit {

  public signUpForm: FormGroup;
  public userModule: Usuario;
  public registerOk: boolean;
  
  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private service: ServiceFirebaseService, private router: Router) { 
    this.buildForm();
    this.userModule = new Usuario();
  }

  ngOnInit() {
    var navbar = document.getElementById('navbar');
    navbar.classList.add('display-none');
  }

  private buildForm() {
    this.signUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  checkName(event) {
    if(event.charCode < 65 || event.charCode > 90 ) {
      this.registerOk = false;
    } 
    if(event.charCode < 97 || event.charCode > 122) {
      this.registerOk = false;
    } 
  }

  checkUsername(event) {
    if(event.charCode < 65 || event.charCode > 90) {
      this.registerOk = false;
    } 
    if(event.charCode < 97 || event.charCode > 122) {
      this.registerOk = false;
    } 
    if(event.charCode < 48 || event.charCode > 57) {
      this.registerOk = false;
    }
  }

  throwErrorMessagePasswords() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px'
    });
  }

  throwFailRegisterDialog() {
    const dialogRef = this.dialog.open(DialogErrorRegistration, {
      width: '250px'
    });
  }

  throwOkDialog() {
    const dialogRef = this.dialog.open(DialogOkRegistration, {
      width: '250px'
    });
    this.router.navigate(['iniciar_sesion']);
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


  register() {
    this.registerOk = false;
    const userRegister = this.signUpForm.value;
    this.userModule.name = userRegister.name;
    this.userModule.surname = userRegister.surname;
    this.userModule.username = userRegister.username;
    this.userModule.password = userRegister.password1;
    this.userModule.email = userRegister.email;
    this.userModule.userType = 'patient';

    var password1 = this.signUpForm.controls.password1.value;
    var password2 = this.signUpForm.controls.password2.value;

    this.service.getUser().subscribe(users => {
      var userExists;
      Object.keys(users).forEach( idToken => {
        if(!userExists) {
          if(this.userModule.username == users[idToken].username) {
            userExists = true;
            this.throwEqualUserNameDialog();
          }else if(this.userModule.email == users[idToken].email) {
            userExists = true;
            this.throwEqualMailDialog();
          }
        }
    })
  });
    if(password1 != password2) {
      this.throwErrorMessagePasswords();
      this.registerOk = false;
    }
    
    if(!this.registerOk) {
      this.throwFailRegisterDialog();
    }else{
      this.service.addUser(this.userModule).subscribe(resp => {
        this.throwOkDialog();
      });
    }
  }
}

@Component({
  selector: 'dialog-error-passwords',
  templateUrl: 'dialog-error-passwords.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-fail-registration',
  templateUrl: 'dialog-fail-registration.html',
})
export class DialogErrorRegistration {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-ok-registration',
  templateUrl: 'dialog-ok-registration.html',
})
export class DialogOkRegistration {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-user-existent',
  templateUrl: 'dialog-user-existent.html',
})
export class DialogUserExistent {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-mail-existent',
  templateUrl: 'dialog-mail-existent.html',
})
export class DialogMailExistent {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
