import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { Usuario } from '../crear-cuenta/usuario.module';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DialogOverviewExampleDialog } from '../crear-cuenta/crear-cuenta.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { SendPushNotifactionService } from 'src/app/services/send-push-notifaction.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.scss']
})
export class IniciarSesionComponent implements OnInit {
  
  public signInForm: FormGroup;
  public user: Usuario;
  public users: Usuario[];
  public arrayUsers;
  public isPatient: Boolean;
  public token: string;
  constructor(private formBuilder: FormBuilder, private service: ServiceFirebaseService, public route: Router, private db: AngularFirestore, public dialog: MatDialog, public router: Router, private sendPush: SendPushNotifactionService) { }
  usersObservable: Observable<any[]>;
  ngOnInit() {
    this.isPatient = false;
    var navbar = document.getElementById('navbar');
    navbar.classList.add('display-none');
    navbar.classList.remove('display-block');
    this.buildForm();
    setInterval(() => {
      this.callSendPush(); 
    }, 5000);
  }

  private buildForm() {
    this.signInForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  throwFailSignIn() {
    const dialogRef = this.dialog.open(DialogFailSignIn, {
      width: '250px'
    });
  }

  signIn() {
    const user = this.signInForm.value;
    const username = user.userName;
    const password = user.password;
    this.service.getUser().subscribe(users => {
      var findObjectUser = false;
       Object.keys(users).forEach( idToken => {
        if(users[idToken].username == username) {
          var userFind = users[idToken];
          if(userFind.userType == "patient" && userFind.password == password) {
            findObjectUser = true;
            this.service.saveToken(idToken, userFind.userType);
            this.route.navigate(['/home']);
          }else if(userFind.userType == "doctor" && userFind.password == password){
            findObjectUser = true;
            this.service.saveToken(idToken, userFind.userType);
           this.route.navigate(['/homeDoctor']);
          }
        }
      });
      if(!findObjectUser) {
        this.throwFailSignIn();
      }
    });
    
  }

  callSendPush(){
    this.sendPush.sendPostRequest();
  }
}

@Component({
  selector: 'error-signIn',
  templateUrl: 'error-signIn.html',
})
export class DialogFailSignIn {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
