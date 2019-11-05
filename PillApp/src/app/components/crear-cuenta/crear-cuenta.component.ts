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
  private regiterNotOk: boolean;
  private emptyParameter: boolean;

  
  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private service: ServiceFirebaseService, private router: Router) { 
    this.buildForm();
    this.userModule = new Usuario();
    this.regiterNotOk = false;
    this.emptyParameter = false;
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

  checkName(name) {
    var hasNumber = /\d/;
    return hasNumber.test(name);
  }

  checkUsername(username) {
    var hasNumber = /\d/;
    return !hasNumber.test(username);
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

  throwEmptyParameter(){
    const dialogRef = this.dialog.open(DialogEmptyParameter, {
      width: '250px'
    });
  }

  checkUserExist(users, idToken){
    if(this.userModule.username == users[idToken].username) {
      this.throwEqualUserNameDialog();
      return true;
    }else if(this.userModule.email == users[idToken].email) {
      this.throwEqualMailDialog();
      return true;
    }
    return false;
  }

  register() {
    var notEqualPasswords = false;
    var registerFail = false;

    const userRegister = this.signUpForm.value;
    this.userModule.name = userRegister.name;
    this.userModule.surname = userRegister.surname;
    this.userModule.username = userRegister.username;
    this.userModule.password = userRegister.password1;
    this.userModule.email = userRegister.email;
    this.userModule.userType = 'patient';
    registerFail = this.checkName(this.userModule.name);
    if(!registerFail){
      registerFail = this.checkName(this.userModule.surname);
    }
    if(!registerFail){
      registerFail = this.checkUsername(this.userModule.username);
    }

    var password1 = this.signUpForm.controls.password1.value;
    var password2 = this.signUpForm.controls.password2.value;

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

@Component({
  selector: 'dialog-empty-parameter',
  templateUrl: 'dialog-empty-parameter.html',
})
export class DialogEmptyParameter {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
