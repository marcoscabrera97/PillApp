import { Component, OnInit } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { NgProgress } from 'ngx-progressbar';




@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss'],
  
})
export class InformeComponent implements OnInit {

  public days;
  public recordatories;
  public percentatge;

  constructor(private service: ServiceFirebaseService, public ngProgress: NgProgress) { 
    this.recordatories = new Array();
    this.days = new Array();
    this.percentatge = 0;
    this.createReport();
  }

  ngOnInit() {
    
  }

  createReport(){
    var currentMonth: string[] = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Agost", "Sept", "Oct", "Nov", "Dic"];  
      this.service.getRecordatoriesHistoric().subscribe(recordatories => {
        for(let i = 0; i<7; i++){
          let insertedDate = true;
          this.recordatories = [];
        Object.keys(recordatories).forEach(recordatory => {
          let selectedDate = new Date();
          selectedDate.setDate(selectedDate.getDate() - i);
          selectedDate = this.set0Hours(selectedDate);
          let dateRecordatory = new Date(recordatories[recordatory].fecha);
          dateRecordatory = this.set0Hours(dateRecordatory);
          
          if(dateRecordatory.toString() == selectedDate.toString()){
            this.recordatories.push(recordatories[recordatory])
          }
          if(insertedDate && this.recordatories.length != 0){
            let fecha = selectedDate.getDate()+' '+currentMonth[selectedDate.getMonth()]+', '+selectedDate.getFullYear();
            this.recordatories[0]['date'] = fecha;
            insertedDate = false;
          }
          
      });
      if(this.recordatories.length != 0){
        this.days.push(this.recordatories);
      }
      }
      console.log(this.days);
      this.certainPercentage();
    })
  }

  certainPercentage(){
    console.log(this.days);
    let count = 0;
    let total = 0;
    for(let i = 0; i < this.days.length; i++){
      for(let j = 0; j < this.days[i].length; j++){
        console.log(this.days[i][j]);
        if(this.days[i][j].take){
          count = count + 1;
        }
        total = total + 1;
      }
    }
    this.percentatge = (count /  total) * 100; 
  }

  set0Hours(date){
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
  }
}
