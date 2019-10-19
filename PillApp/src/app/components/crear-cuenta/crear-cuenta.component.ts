import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from './usuario.module';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.scss']
})
export class CrearCuentaComponent implements OnInit {

  public signUpForm: FormGroup;
  public userModule: Usuario;
  public registerOk: boolean;
  
  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) { 
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

  register() {
    const userRegister = this.signUpForm.value;
    this.userModule.name = userRegister.name;
    this.userModule.surname = userRegister.surname;
    this.userModule.username = userRegister.username;
    this.userModule.password = userRegister.password;
    this.userModule.email = userRegister.email;

    var password1 = this.signUpForm.controls.password1.value;
    var password2 = this.signUpForm.controls.password2.value;
    

    if(password1 != password2) {
      this.throwErrorMessagePasswords();
    }
    if(!this.registerOk) {
      this.throwFailRegisterDialog();
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
