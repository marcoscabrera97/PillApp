import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { RecordatorioHistorico } from '../home/recordatorio-historico.module';


@Component({
  selector: 'app-search-informe',
  templateUrl: './search-informe.component.html',
  styleUrls: ['./search-informe.component.scss']
})
export class SearchInformeComponent implements OnInit {

  public searchInforme: FormGroup;
  public showRecordatoriesHistoric: RecordatorioHistorico[];
  public showInform: boolean;
  public percent: number;
  private startDateInform;
  private finishDateInform;
  public days;

  constructor(private formBuilder: FormBuilder, private service: ServiceFirebaseService) { 
    this.days = new Array();
    this.showInform = false;
    this.percent = 0;
    this.showRecordatoriesHistoric = new Array();
    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm(){
    this.searchInforme = this.formBuilder.group({
      namePatient: ['', Validators.required],
      surnamePatient: ['', Validators.required],
      cipPatient: ['', Validators.required]
    })
  }

  selectDateInform(){
    var actualDate = new Date();
    var startDayInform = actualDate.getDate() - actualDate.getDay() + 1;
    var finishDayInform = actualDate.getDate() + (7 - actualDate.getDay());
    
    this.startDateInform = new Date(actualDate.setDate(startDayInform));
    this.finishDateInform = new Date(actualDate.setDate(finishDayInform));
  }

  searchInform(){
    var currentMonth: string[] = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Agost", "Sept", "Oct", "Nov", "Dic"];  
    this.showInform = true;
    const searchInformValues = this.searchInforme.value;
    //this.selectDateInform();
    
    this.service.getUser().subscribe(users => {
      Object.keys(users).forEach(user => {
        if(users[user].cip == searchInformValues.cipPatient && users[user].userType == 'patient'){
          this.service.getRecordatoriesHistoric().subscribe(recordatories => {
            var count = 0;
            this.selectDateInform();
            var i = 0;
            while(i < 7){
              var insertedDate = true;
              this.showRecordatoriesHistoric = [];
              Object.keys(recordatories).forEach(recordatory => {
                var selectedDate = new Date();
                selectedDate.setDate(this.startDateInform.getDate() + i);
                selectedDate = this.set0Hours(selectedDate);
                let dateRecordatory = new Date(recordatories[recordatory].fecha);
                dateRecordatory = this.set0Hours(dateRecordatory);
                
                
                if(recordatories[recordatory].idUser == user && dateRecordatory.toString() == selectedDate.toString()){
                  this.showRecordatoriesHistoric.push(recordatories[recordatory]);
                  count = count + 1;
                }
                if(insertedDate && this.showRecordatoriesHistoric.length != 0){
                  let fecha = selectedDate.getDate()+' '+currentMonth[selectedDate.getMonth()]+', '+selectedDate.getFullYear();
                  this.showRecordatoriesHistoric[0]['fecha'] = fecha;
                  insertedDate = false;
                }
              });
              if(this.showRecordatoriesHistoric.length != 0){
                this.days.push(this.showRecordatoriesHistoric);
              }
              i++;
            }
            this.certainPercentage();
          });
        }
      })

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
    this.percent = (count /  total) * 100; 
  }

  set0Hours(date){
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
  }

}
