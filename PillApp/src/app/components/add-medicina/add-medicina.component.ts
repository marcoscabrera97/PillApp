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
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';

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

  public idMedicine: number;

  constructor(private atp: AmazingTimePickerService, private formBuilder: FormBuilder, private service: ServiceFirebaseService) {
    this.numberDays = false;
    this.specificDays = false;
    this.time = [":", ":", ":", ":"];
    this.medicine = new Medicina();
    this.recordatory = new Recordatorio();
    this.recordatory.hour = ["-1", "-1", "-1", "-1"];
    this.recordatory.idMedicine = "";
    this.buildForm();
  }

  ngOnInit() {
  }

  selectDose(){
    
  }

  buildForm() {
    this.addMedicineForm = this.formBuilder.group({
      nameMedicine: ['', Validators.required],
      quantity: ['', Validators.required],
      quantityDose: ['', Validators.required],
      unityDose: ['', Validators.required],
      selectTimeHour0: ['', Validators.required],
      selectTimeHour1: ['', Validators.required],
      selectTimeHour2: ['', Validators.required],
      selectTimeHour3: ['', Validators.required],
      dateStart: ['', Validators.required],
      numberDaysInput: ['', Validators.required],
      monday: ['', Validators.required],
      thursday: ['', Validators.required],
      wednesday: ['', Validators.required],
      tuesday: ['', Validators.required],
      friday: ['', Validators.required],
      saturday: ['', Validators.required],
      sunday: ['', Validators.required]
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
      this.recordatory.numberDays = -1;
      const addMedicineForm = this.addMedicineForm.value;
      addMedicineForm.numberDaysInput = '';
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
      this.time[id] = time;
      this.recordatory.hour.splice(id, 1, time);
    });
  }

  saveMedicine(){
    const addMedicineForm = this.addMedicineForm.value;
    this.medicine.name = addMedicineForm.nameMedicine;
    this.medicine.quantity = addMedicineForm.quantity;
    this.medicine.quantityDose = addMedicineForm.quantityDose;
    this.medicine.unityDose = addMedicineForm.unityDose;
    var date = addMedicineForm.dateStart['_i'];
    this.recordatory.startDate = date.date+"/"+(date.month+1)+"/"+date.year;
    if(addMedicineForm.numberDaysInput != '' && this.recordatory.numberDays != -1){
      this.recordatory.numberDays = addMedicineForm.numberDaysInput;
    }else if(addMedicineForm.numberDaysInput != '' && this.recordatory.numberDays == -1){
      this.recordatory.numberDays = addMedicineForm.numberDaysInput;
    }
    if(addMedicineForm.monday == ''){
      this.recordatory.monday = false;
    }else{
      this.recordatory.monday = addMedicineForm.monday;
    }
    if(addMedicineForm.thursday == ''){
      this.recordatory.thursday = false;
    }else{
      this.recordatory.thursday = addMedicineForm.thursday;
    }
    if(addMedicineForm.wednesday == ''){
      this.recordatory.wednesday = false;
    }else{
      this.recordatory.wednesday = addMedicineForm.wednesday;
    }
    if(addMedicineForm.tuesday == ''){
      this.recordatory.tuesday = false;
    }else{
      this.recordatory.tuesday = addMedicineForm.tuesday;
    }
    if(addMedicineForm.friday == ''){
      this.recordatory.friday = false;
    }else{
      this.recordatory.friday = addMedicineForm.friday;
    }
    if(addMedicineForm.saturday == ''){
      this.recordatory.saturday = false;
    }else{
      this.recordatory.saturday = addMedicineForm.saturday;
    }
    if(addMedicineForm.sunday == ''){
      this.recordatory.sunday = false;
    }else{
      this.recordatory.sunday = addMedicineForm.sunday;
    }
    this.medicine.idUser = this.service.userToken;
    this.service.addMedicine(this.medicine).subscribe(resp => {
      this.idMedicine = resp['name'];
      this.recordatory.idMedicine = this.idMedicine;
      this.service.addRecordatory(this.recordatory).subscribe(resp => {
      })
    });
  }
}
