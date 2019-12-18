import { Component, OnInit } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { Subscription } from 'rxjs';
import { Consulta } from './consulta.module';

@Component({
  selector: 'app-home-doctor',
  templateUrl: './home-doctor.component.html',
  styleUrls: ['./home-doctor.component.scss']
})
export class HomeDoctorComponent implements OnInit {

  public actualDate;
  private actualDateRef: Subscription = null;
  public consultas: Consulta [];


  constructor(private service: ServiceFirebaseService) { 
    var navbar = document.getElementById('navbar');
    navbar.classList.remove('display-none');
    navbar.classList.add('display-block');
    this.actualDate = this.service.actualDate.toLocaleDateString();
    this.showConsultas();
  }

  ngOnInit() {
    this.actualDateRef = this.service.changeDate$.subscribe((resp)  =>{
      this.actualDate = this.service.actualDate.toLocaleDateString();
      this.showConsultas();
    });
  }

  changeConsulta(idConsulta, event){

  }

  showConsultas(){
    this.service.getConsultas().subscribe(resp => {
      console.log(resp);
    })
  }

}
