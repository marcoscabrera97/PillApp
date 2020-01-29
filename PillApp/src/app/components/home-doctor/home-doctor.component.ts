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
  public consultaRealizada: boolean[];
  public hideMatFormField: boolean;


  constructor(private service: ServiceFirebaseService) { 
    this.consultaRealizada = new Array();
    var navbar = document.getElementById('navbar');
    navbar.classList.remove('display-none');
    navbar.classList.add('display-block');
    this.consultas = new Array();
    this.actualDate = this.service.actualDate.toLocaleDateString();
    this.showConsultas();
  }

  ngOnInit() {
    this.service.openMenuVar$.subscribe(openMenu => {
      if(openMenu){
        this.hideMatFormField = true;
      }else{
        this.hideMatFormField = false;
      }
    });
    this.actualDateRef = this.service.changeDate$.subscribe((resp)  =>{
      this.actualDate = this.service.actualDate.toLocaleDateString();
      this.showConsultas();
    });
  }

  orderDates(){
    var count = 0;
    var length = Object.keys(this.consultas).length;
    var auxConsultas = new Array();
    for(var i = 0; i < length; i++){
      var firstTime = true;
      var minimunValue = new Date();
      var element;
      var indexDelete;
      minimunValue.setHours(0);
      minimunValue.setMinutes(0);
      minimunValue.setSeconds(0);
      for(var j = 0; j < Object.keys(this.consultas).length; j++){
        var actualDate = new Date(this.consultas[j].fecha);
        if(firstTime || minimunValue >= actualDate){
          firstTime = false;
          minimunValue = actualDate;
          element = this.consultas[j];
          indexDelete = j;
        }
      }
      this.consultas.splice(indexDelete,1);
      auxConsultas.push(element);
    }
    if(Object.keys(this.consultas).length > 0){
      auxConsultas[count] = this.consultas[0];
    }
    this.consultas = auxConsultas;
  }

  changeConsulta(idConsulta, event){
    this.service.getSpecificConsulta(idConsulta).subscribe(consulta => {
      var auxConsulta = consulta;
      auxConsulta['visitaRealizada'] = event;
      this.consultaRealizada[idConsulta] = event;
      this.service.updateConsulta(idConsulta, auxConsulta).subscribe();
    })
  }

  showConsultas(){
    this.consultas = new Array();
    this.service.getConsultas().subscribe(consultas => {
      Object.keys(consultas).forEach(consulta => {
        var actualDateAux = this.service.actualDate;
        actualDateAux.setHours(0);
        actualDateAux.setMinutes(0);
        actualDateAux.setSeconds(0);
        actualDateAux = actualDateAux.getTime() - actualDateAux.getTime()%1000;
        var fechaCita = new Date(consultas[consulta].fecha);
        if(this.service.actualDate.getDate() == fechaCita.getDate() && this.service.actualDate.getMonth() == fechaCita.getMonth() && this.service.actualDate.getFullYear() == fechaCita.getFullYear()){
          var horas;
          var minutos;
          if(fechaCita.getHours() <= 9){
            horas = '0' + fechaCita.getHours(); 
          }else{
            horas = fechaCita.getHours();
          }
          if(fechaCita.getMinutes() <= 9){
            minutos = '0' + fechaCita.getMinutes(); 
          }else{
            minutos = fechaCita.getMinutes();
          }
          consultas[consulta]['hour'] = horas + ':' + minutos+ 'h';
          this.service.getUser().subscribe(users => {
            Object.keys(users).forEach(idUser => {
              if(users[idUser].cip == consultas[consulta].cip){
                this.consultaRealizada[consulta] = consultas[consulta]['visitaRealizada'];
                consultas[consulta]['id'] = consulta;
                consultas[consulta]['name'] = users[idUser].name;
              }
            })
            this.consultas.push(consultas[consulta]);
        })
      }
      });
      setTimeout(() => {
        this.orderDates();
      }, 1000);
      if(this.service.fromAddCitaDoctor){   
        this.service.fromAddCitaDoctor = false;   
        window.location.reload();
      }
    })
    
  }

}
