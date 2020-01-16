import { Component, OnInit } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';


@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent implements OnInit {
  
  private user: string;
  public showUsers;

  constructor(private service: ServiceFirebaseService) { 
    this.user = "";
    this.showUsers = new Array();
    this.service.getUser().subscribe(users => {
      Object.keys(users).forEach(user => {
        this.showUsers[users[user].cip] = users[user];
      });
    });
  }

  ngOnInit() {
  }

  searchUser(event){  
    this.showUsers = new Array();   
    if(event.key == 'Backspace'){
      this.user = this.user.substring(0, this.user.length - 1);
    }else{
      this.user += event.key;
    }
    this.service.getUser().subscribe(users => {
      Object.keys(users).forEach(user => {
        if(users[user].username.includes(this.user) && !this.showUsers.includes(users[user].cip)){
          this.showUsers[users[user].cip] = users[user];
        }
      })
      console.log(this.showUsers);
    })
  }

}
