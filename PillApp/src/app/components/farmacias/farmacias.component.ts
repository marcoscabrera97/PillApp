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
  hideMatFormField: boolean;


  constructor(private service: ServiceFirebaseService) {
    this.showMap = false;
    this.pharmacies = new Array();
    this.coordenadas = new Array();
    this.getLocation();
  }

  ngOnInit() {
    this.service.openMenuVar$.subscribe(openMenu => {
      if(openMenu){
        this.hideMatFormField = true;
      }else{
        this.hideMatFormField = false;
      }
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          const proxyurl = "https://cors-anywhere.herokuapp.com/";
          const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+this.lat+","+this.lng+"&radius=1000&type=pharmacy&keyword=farmacia&key=AIzaSyBtI_hiSMu6pcJcsvryBFa7jfS5dLR_bD4";
          fetch(proxyurl + url)
          .then(response => response.text())
          .then(contents => {
            var json = JSON.parse(contents)
            json['results'].forEach(pharmacy => {
              this.pharmacies.push(pharmacy);
              this.coordenadas.push([pharmacy['geometry'].location.lat, pharmacy['geometry'].location.lng]);
            })
          })
          .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
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
