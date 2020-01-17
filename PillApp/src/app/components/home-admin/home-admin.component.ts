import { Component, OnInit, Inject } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../lista-medicamentos/lista-medicamentos.component';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent implements OnInit {
  
  private user: string;
  public showUsers;

  constructor(private service: ServiceFirebaseService, public dialog: MatDialog,) { 
    this.user = "";
    var navbar = document.getElementById('navbar');
    navbar.classList.remove('display-none');
    navbar.classList.add('display-block');
    this.searchAllUsers();
  }

  ngOnInit() {
  }

  searchAllUsers(){
    this.showUsers = new Array();
    this.service.getUser().subscribe(users => {
      Object.keys(users).forEach(user => {
        if(users[user].username != 'admin'){
          users[user]['id'] = user;
          this.showUsers.push(users[user]);
        }
      });
    });
  }

  searchUser(event){  
    var dentro = 0;
    this.showUsers = new Array(); 
    if(event.key == 'Backspace'){
      this.user = this.user.substring(0, this.user.length - 1);
    }else{
      this.user += event.key;
    }
    this.service.getUser().subscribe(users => {
      Object.keys(users).forEach(user => {
        if(users[user].username.includes(this.user) && users[user].username != 'admin'){
          dentro += 1;
          if(dentro > this.showUsers.length){
            users[user]['id'] = user;
            this.showUsers.push(users[user]);
          }
        }
      })
    })
  }

  deleteUser(userId: string){
    const dialogRef = this.dialog.open(ConfirmDeleteUser, {
      data: {userId: userId}
    });
    dialogRef.afterClosed().subscribe(resp => {
      this.searchAllUsers();
    });
  }

}

@Component({
  selector: 'confirmDeleteUser',
  templateUrl: 'confirmDeleteUser.html',
})
export class ConfirmDeleteUser {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteUser>, private service: ServiceFirebaseService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDeleteUser(userId){
    this.service.deleteUserBd(userId).subscribe(    resp => {
      this.dialogRef.close();
    });
  }
}
