import { Component, OnInit } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';


@Component({
  selector: 'app-farmacias',
  templateUrl: './farmacias.component.html',
  styleUrls: ['./farmacias.component.scss']
})
export class FarmaciasComponent implements OnInit {

  title = 'My first AGM project';
  lat: number;
  lng: number;
  coordenadas;
  showMap: boolean;
  pharmacies;



  constructor(private service: ServiceFirebaseService) {
    this.showMap = false;
    this.pharmacies = new Array();
    this.coordenadas = new Array();
    this.getLocation();
  }

  ngOnInit() {
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.service.getPharmacies(this.lat, this.lng).subscribe(pharmacies => {
            pharmacies['results'].forEach(pharmacy => {
              this.pharmacies.push(pharmacy);
              this.coordenadas.push([pharmacy['geometry'].location.lat, pharmacy['geometry'].location.lng]);
            })
          });
        }
      },
        (error: PositionError) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  activateMap(){
    if(this.showMap) {
      this.showMap = false;
    }else{
      this.showMap = true;
    }
  }

}
