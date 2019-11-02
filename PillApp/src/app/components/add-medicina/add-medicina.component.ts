import { Component, OnInit } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ɵHttpInterceptingHandler } from '@angular/common/http';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';

import {default as _rollupMoment} from 'moment';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { Medicina } from './medicina.module';
import { Recordatorio } from './recordatorio.module';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};



@Component({
  selector: 'app-add-medicina',
  templateUrl: './add-medicina.component.html',
  styleUrls: ['./add-medicina.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class AddMedicinaComponent implements OnInit {

  public numberDays: boolean;
  public specificDays: boolean;
  public time: string [];
  public selectTime;
  public medicine: Medicina;
  public addMedicineForm: FormGroup;
  public recordatory: Recordatorio;

  constructor(private atp: AmazingTimePickerService, private formBuilder: FormBuilder) {
    this.numberDays = false;
    this.specificDays = false;
    this.time = ["08:00", "08:00", "08:00", "08:00"];
    this.medicine = new Medicina();
    this.recordatory = new Recordatorio();
    this.recordatory.hour = ["08:00", "08:00", "08:00", "08:00"];

    this.buildForm();
  }

  ngOnInit() {
  }

  selectDose(){
    
  }

  buildForm() {
    this.addMedicineForm = this.formBuilder.group({
      nameMedicine: ['', Validators.required],
      quantityDose: ['', Validators.required],
      unityDose: ['', Validators.required],
      selectTimeHour0: ['', Validators.required],
      selectTimeHour1: ['', Validators.required],
      selectTimeHour2: ['', Validators.required],
      selectTimeHour3: ['', Validators.required]

    });
  }

  selectDayDoses(selectOptionValue){
    var selectTime;
    if(selectOptionValue == '1dose'){
      selectTime = 1;
    }else if(selectOptionValue == '2dose'){
      selectTime = 2;
    }else if(selectOptionValue == '3dose'){
      selectTime = 3;
    }else if(selectOptionValue == '4dose'){
      selectTime = 4;
    }
    this.selectTime = Array(selectTime).fill(0).map((x,i)=>i);
  }

  showNumberDaysInput(inputSelectDays) {
    if(!inputSelectDays) {
      this.numberDays = false;
    }else{
      this.numberDays = true;
    }
  }

  showSpecificDays(inputSpecificDays){
    if(!inputSpecificDays) {
      this.specificDays = false;
    }else{
      this.specificDays = true;
    }
  }

  open(id) {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      console.log('dentro after close');
      this.time[id] = time;
      this.recordatory.hour.splice(id, 1, time);
      this.cambioHora();
    });
  }

  saveMedicine(){
    const addMedicineForm = this.addMedicineForm.value;
    this.medicine.name = addMedicineForm.nameMedicine;
    this.medicine.quantityDose = addMedicineForm.quantityDose;
    this.medicine.unityDose = addMedicineForm.unityDose;
    
    console.log('dentro saveMedicine');
    console.log(this.recordatory.hour);
  }

  cambioHora(){
    /*if(this.selectTime.length == 1){
      this.addMedicineForm = this.formBuilder.group({
        selectTimeHour0: ['', Validators.required]
      });
    }else if(this.selectTime.length == 2){
      this.addMedicineForm = this.formBuilder.group({
        selectTimeHour0: ['', Validators.required],
        selectTimeHour1: ['', Validators.required]
      });
    }else if(this.selectTime.length == 3){
      this.addMedicineForm = this.formBuilder.group({
        selectTimeHour0: ['', Validators.required],
        selectTimeHour1: ['', Validators.required],
        selectTimeHour2: ['', Validators.required]
      });
    }else if(this.selectTime.length == 4){
      this.addMedicineForm = this.formBuilder.group({
        selectTimeHour0: ['', Validators.required],
        selectTimeHour1: ['', Validators.required],
        selectTimeHour2: ['', Validators.required],
        selectTimeHour3: ['', Validators.required]
      });
    }*/
    
  }
  
}
