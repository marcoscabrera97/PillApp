import { Component, OnInit } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ɵHttpInterceptingHandler } from '@angular/common/http';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';

import {default as _rollupMoment} from 'moment';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { Medicina } from './medicina.module';

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
  public time;
  public selectTime;
  public medicine: Medicina;
  public addMedicineForm: FormGroup;

  constructor(private atp: AmazingTimePickerService, private formBuilder: FormBuilder) {
    this.numberDays = false;
    this.specificDays = false;
    this.time = "8:00";
    this.medicine = new Medicina();
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
      unityDose: ['', Validators.required]
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

  open() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.time = time;
    });
  }

  saveMedicine(){
    const addMedicineForm = this.addMedicineForm.value;
    this.medicine.name = addMedicineForm.nameMedicine;
    this.medicine.quantityDose = addMedicineForm.quantityDose;
    this.medicine.unityDose = addMedicineForm.unityDose;
    console.log('dentro saveMedicine');
    console.log(this.medicine.quantityDose);
    console.log(this.medicine.unityDose);
  }

  
}
