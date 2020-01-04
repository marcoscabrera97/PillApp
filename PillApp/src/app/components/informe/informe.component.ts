import { Component, OnInit } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss'],
  
})
export class InformeComponent implements OnInit {

  public days;
  public recordatories;
  public percentatge;
  private startDateInform;


  constructor(private service: ServiceFirebaseService) { 
    this.recordatories = new Array();
    this.days = new Array();
    this.percentatge = 0;
    this.createReport();
  }

  ngOnInit() {
    
  }

  selectDateInform(){
    var actualDate = new Date();
    var startDayInform = actualDate.getDate() - actualDate.getDay() + 1;
    var startDayInformDate = new Date(startDayInform);
    if(startDayInformDate.getDay() > actualDate.getDay()){
      actualDate.setMonth(actualDate.getMonth() - 1);
    }
    this.startDateInform = new Date(actualDate.setDate(startDayInform));
  }

  createReport(){
    var currentMonth: string[] = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Agost", "Sept", "Oct", "Nov", "Dic"];  
      this.service.getRecordatoriesHistoric().subscribe(recordatories => {
        var count = 0;
        this.selectDateInform();
        var i = 0;
        while(i < 7){
          let insertedDate = true;
          this.recordatories = [];
          Object.keys(recordatories).forEach(recordatory => {
            let selectedDate = new Date();
            selectedDate.setMonth(this.startDateInform.getMonth());
            selectedDate.setFullYear(this.startDateInform.getFullYear());
            selectedDate.setDate(this.startDateInform.getDate() + i);
            
            selectedDate = this.set0Hours(selectedDate);
            let dateRecordatory = new Date(recordatories[recordatory].fecha);
            dateRecordatory = this.set0Hours(dateRecordatory);
            if(dateRecordatory.toString() == selectedDate.toString() && recordatories[recordatory].idUser == this.service.userToken){
              this.recordatories.push(recordatories[recordatory]);
              count = count + 1;
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

        i++;
      }
      this.certainPercentage();
    })
  }

  certainPercentage(){
    let count = 0;
    let total = 0;
    for(let i = 0; i < this.days.length; i++){
      for(let j = 0; j < this.days[i].length; j++){
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
