import { Component, OnInit } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';

@Component({
  selector: 'app-lista-medicamentos',
  templateUrl: './lista-medicamentos.component.html',
  styleUrls: ['./lista-medicamentos.component.scss']
})
export class ListaMedicamentosComponent implements OnInit {

  public medicines;
  constructor(private service: ServiceFirebaseService) { 
    this.medicines = new Array();
    this.getMedicines();
  }
  ngOnInit() {
  }

  getMedicines(){
    this.service.getMedicines().subscribe(medicines => {
      Object.keys(medicines).forEach(medicine => {
        if(medicines[medicine].idUser == this.service.userToken){
          this.medicines.push(medicines[medicine]);
        }
      });
    })
  }

}
