import { Component, OnInit, HostListener } from '@angular/core';
import { $ } from 'protractor';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public diasSemana;
  public diasMes;
  collapse: boolean[];

  constructor() {
    var navbar = document.getElementById('navbar');
    navbar.classList.remove('display-none');
    navbar.classList.add('display-block');
    this.diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    this.diasMes = 31;
    this.collapse = new Array(false, false, false);
  }

  ngOnInit() {
    
  }

  openCollapse(id) {
    if(this.collapse[id]) {
      this.collapse[id] = false;
    }else{
      this.collapse[id] = true;
    }
  }

}
