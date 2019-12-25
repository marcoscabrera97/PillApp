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

  constructor(private formBuilder: FormBuilder, private service: ServiceFirebaseService) { 
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

  searchInform(){
    this.showInform = true;
    const searchInformValues = this.searchInforme.value;
    this.service.getUser().subscribe(users => {
      Object.keys(users).forEach(user => {
        if(users[user].cip == searchInformValues.cipPatient && users[user].userType == 'patient'){
          this.service.getRecordatoriesHistoric().subscribe(recordatories => {
            var count = 0;
            Object.keys(recordatories).forEach(recordatory => {
              if(recordatories[recordatory].idUser == user){
                this.showRecordatoriesHistoric.push(recordatories[recordatory]);
                count = count + 1;
              }
            });
            var takeMedicine = 0;
            Object.keys(this.showRecordatoriesHistoric).forEach(recordatory => {
              if(this.showRecordatoriesHistoric[recordatory]['take']){
                takeMedicine = takeMedicine + 1;
              }
            })
            this.percent = (takeMedicine / count) * 100;
          });
        }
      })
    })
  }

}
