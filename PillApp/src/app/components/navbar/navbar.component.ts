import { Component, OnInit} from '@angular/core';
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
  constructor(private router: Router, private service: ServiceFirebaseService, private route:ActivatedRoute) {
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if(val.url == '/home'){
          this.isHome = true;
        }else{
          this.isHome = false;
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


}
