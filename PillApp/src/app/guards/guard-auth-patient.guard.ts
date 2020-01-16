import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServiceFirebaseService } from '../services/service-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class GuardAuthPatientGuard implements CanActivate {

  constructor(private service: ServiceFirebaseService, private router: Router){}

  canActivate() {
    if(this.service.isAuthenticated() != null){
      if(this.service.typeUser == "patient") {
        return true;
      }else{
        this.router.navigateByUrl('/login');
        return false;
      }
    }else{
      this.router.navigateByUrl('/login');
      return false;
    }
  }
  
  
}
