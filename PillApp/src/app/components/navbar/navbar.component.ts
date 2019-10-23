import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public href: string = "";
  constructor(private router: Router, private service: ServiceFirebaseService) { }

  ngOnInit() {
  }

  logout() {
    this.service.deleteUser();
    this.router.navigateByUrl('/login');
  }

}
