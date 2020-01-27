import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceFirebaseService } from '../services/service-firebase.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AllGuardsGuard implements CanActivate {
  constructor(private service: ServiceFirebaseService, private router: Router){}

  canActivate() {
    if(this.service.isAuthenticated() != null){
      if(this.service.typeUser == "patient" || this.service.typeUser == "doctor" || this.service.typeUser == "admin") {
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
