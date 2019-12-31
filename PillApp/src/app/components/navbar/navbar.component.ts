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
  isPatient: boolean;
  showAddMedicine: boolean;

  constructor(private router: Router, private service: ServiceFirebaseService, private route:ActivatedRoute) {
    this.show = false;
    
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
      this.show = false;
    }else{
      this.show = true;
    }
    if(localStorage.getItem('typeUser') == 'patient'){
      this.isPatient = true;
    }else{
      this.isPatient = false;
    }
  }

  closeMenu(){
    if(this.show){
      this.show = false;
    }
  }


}
