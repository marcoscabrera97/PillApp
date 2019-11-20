import { Component, OnInit } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalles-cita',
  templateUrl: './detalles-cita.component.html',
  styleUrls: ['./detalles-cita.component.scss']
})
export class DetallesCitaComponent implements OnInit {

  public dateDetails;
  public idDate;
  public nameDoctor: string;
  public speciality: string;
  public plant: number; 
  public door: number;
  public ubication: string;
  public street: string;
  public locality: string;
  public province: string;
  public postalCode: number;

  constructor(public service: ServiceFirebaseService, private activatedRouter: ActivatedRoute) { 
    this.activatedRouter.params.subscribe(params =>{
      this.idDate = params['idDate'];
      this.getDetails();
    })
  }

  ngOnInit() {
  }

  getDetails(){
    this.service.getDate(this.idDate).subscribe(date => {
      let idHospital = date['id_hospital'];
      this.service.getHospital(idHospital).subscribe(hospital => {
        this.nameDoctor = date['nombre_doctor'];
        this.speciality = date['especialidad'];
        this.plant = date['planta'];
        this.door = date['puerta'];
        this.ubication = hospital['nombre_hosp'];
        this.street = hospital['calle'];
        this.locality = hospital['localidad'];
        this.province = hospital['provincia'];
        this.postalCode = hospital['codigo_postal'];
      })
    })
  }
}
