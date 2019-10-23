import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceFirebaseService } from '../services/service-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class GuardAuthGuard implements CanActivate {

  constructor(private service: ServiceFirebaseService, private router: Router){}

  canActivate() {
    console.log(this.service.isAuthenticated());
    if(this.service.isAuthenticated() != null){
      return true;
    }else{
      this.router.navigateByUrl('/login');
      return false;
    }
  }
  
}
