import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {  
  public href: string = "";
  isHome: boolean;
  closeMenuVar: boolean;
  date;
  show: boolean;
  typeUser: string;
  showAddMedicine: boolean;
  idUser: string;
  showButton: boolean;

  constructor(private router: Router, private service: ServiceFirebaseService, private route:ActivatedRoute) {
    this.idUser = localStorage.getItem('token');
    this.show = false;
    this.showButton = true;
    this.service.changeOpenMenuVar(false);
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if(val.url == '/home' || val.url == '/homeDoctor'){
          this.isHome = true;
        }else{
          this.isHome = false;
        }
        if(val.url == '/home'){
          this.showAddMedicine = true;
        }else{
          this.showAddMedicine = false;
        }
        if(val.url == '/farmacias'){
          this.service.showMap$.subscribe(showMap => {
            if(showMap){
              this.showButton = false;
            }else{
              this.showButton = true;
            }
          });
        }
      }
    });
    this.closeMenuVar = false;
  }


  ngOnInit() {      
  }


  logout() {
    this.service.deleteUser();
    this.router.navigateByUrl('/login');
  }

  changeDateSelected(date){
    this.service.setActualDate(date);
  }

  classShow(){
    if(this.show){
      this.service.changeOpenMenuVar(false);
      this.show = false;
    }else{
      this.service.changeOpenMenuVar(true);
      this.show = true;
    }
    if(localStorage.getItem('typeUser') == 'patient'){
      this.typeUser = 'patient';
    }else if(localStorage.getItem('typeUser') == 'doctor'){
      this.typeUser = 'doctor';
    }else if(localStorage.getItem('typeUser') == 'admin'){
      this.typeUser = 'admin';
    }
  }

  closeMenu(){
    if(this.show){
      this.show = false;
    }
  }


}
