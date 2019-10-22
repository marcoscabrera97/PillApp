import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() {
    var navbar = document.getElementById('navbar');
    navbar.style.display = "block";
  }

  ngOnInit() {
    
  }

}
