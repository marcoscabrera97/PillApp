import { Component, OnInit } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ɵHttpInterceptingHandler } from '@angular/common/http';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE, MatDialogRef, MatDialog } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';

import {default as _rollupMoment} from 'moment';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { Medicina } from './medicina.module';
import { Recordatorio } from './recordatorio.module';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { Router } from '@angular/router';
import { DialogOverviewExampleDialog } from '../crear-cuenta/crear-cuenta.component';
import { FooterRowOutlet } from '@angular/cdk/table';

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
  public recordatoryAux: Recordatorio;
  private hoursRecordatory: string[];
  public recordatory: Recordatorio;
  medicamentDose;

  public idMedicine: number;

  constructor(private atp: AmazingTimePickerService, private formBuilder: FormBuilder, private service: ServiceFirebaseService, private router: Router, public dialog: MatDialog) {
    this.numberDays = false;
    this.specificDays = false;
    this.time = [":", ":", ":", ":"];
    this.medicine = new Medicina();
    this.recordatoryAux = new Recordatorio();
    this.recordatoryAux.idMedicine = "";
    this.hoursRecordatory = ["-1", "-1", "-1", "-1"];
    this.buildForm();
  }

  ngOnInit() {
  }

  selectDose(dose){
    this.medicamentDose = dose;
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
      this.recordatoryAux.numberDays = -1;
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
      this.hoursRecordatory.splice(id, 1, time);
    });
  }

  saveMedicine(){
    const addMedicineForm = this.addMedicineForm.value;
    var addMedicineOk = this.checkFormValues(addMedicineForm);
    if(addMedicineOk){
      this.medicine.name = addMedicineForm.nameMedicine;
      this.medicine.quantity = addMedicineForm.quantity;
      this.medicine.quantityDose = addMedicineForm.quantityDose;
      this.medicine.unityDose = addMedicineForm.unityDose;
      this.recordatoryAux.startDate = addMedicineForm.dateStart['_d'].toUTCString(); /*date.date+"/"+(date.month+1)+"/"+date.year;*/
      if(addMedicineForm.numberDaysInput != '' && this.recordatoryAux.numberDays != -1){
        this.recordatoryAux.numberDays = addMedicineForm.numberDaysInput;
      }else if(addMedicineForm.numberDaysInput != '' && this.recordatoryAux.numberDays == -1){
        this.recordatoryAux.numberDays = addMedicineForm.numberDaysInput;
      }
      this.recordatoryAux.daysWeek = new Array();
      if(addMedicineForm.sunday == true){
        this.recordatoryAux.daysWeek.push(1);
      }else{
        this.recordatoryAux.daysWeek.push(0);
      }

      if(addMedicineForm.monday == true){
        this.recordatoryAux.daysWeek.push(1);
      }else{
        this.recordatoryAux.daysWeek.push(0);
      }

      if(addMedicineForm.thursday == true){
        this.recordatoryAux.daysWeek.push(1);
      }else{
        this.recordatoryAux.daysWeek.push(0);
      }

      if(addMedicineForm.wednesday == true){
        this.recordatoryAux.daysWeek.push(1);
      }else{
        this.recordatoryAux.daysWeek.push(0);
      }

      if(addMedicineForm.tuesday == true){
        this.recordatoryAux.daysWeek.push(1);
      }else{
        this.recordatoryAux.daysWeek.push(0);
      }

      if(addMedicineForm.friday == true){
        this.recordatoryAux.daysWeek.push(1);
      }else{
        this.recordatoryAux.daysWeek.push(0);
      }

      if(addMedicineForm.saturday == true){
        this.recordatoryAux.daysWeek.push(1);
      }else{
        this.recordatoryAux.daysWeek.push(0);
      }

      const daysWeekAux = this.recordatoryAux.daysWeek.filter(dayWeek => dayWeek == 0);
      if(daysWeekAux.length == 7){
        this.recordatoryAux.daysWeek = [];
        this.recordatoryAux.daysWeek.push(-1);
      }

      this.medicine.idUser = this.service.userToken;
      this.service.addMedicine(this.medicine).subscribe(resp => {
        this.idMedicine = resp['name'];
        this.recordatoryAux.idMedicine = this.idMedicine;
        var count = 0;
        for(let hour of this.hoursRecordatory ){
          if(hour != "-1" && count < this.selectTime.length){
            this.recordatory = new Recordatorio();
            this.recordatory = this.recordatoryAux;
            this.recordatory.hour = hour;
            this.service.addRecordatory(this.recordatory).subscribe(resp => {
            })
          }
          count++;
        }
        this.router.navigate(['home']);
      });
    }
    
  }

  checkFormValues(addMedicineForm){
    var formOk = true;
    var specificDay = null;
    Object.keys(addMedicineForm).forEach(element => {
      if(formOk != false){
        if((element == 'monday' || element == 'tuesday' || element == 'wednesday' || element == 'thursday' || element == 'friday' || element == 'saturday' || element == 'sunday') && this.specificDays){
          if(specificDay == null || !specificDay){
            if(addMedicineForm[element] != ''){
              specificDay = true;
            }else{
              specificDay = false;
            }
          }
        }

        if(element == 'nameMedicine' && addMedicineForm[element] == ''){
          formOk = false;
        }
        if(element == 'numberDaysInput' && addMedicineForm[element] == '' && this.numberDays){
          formOk = false;
        }
        if(element == 'quantity' && addMedicineForm[element] == ''){
          formOk = false;
        }
        if(element == 'quantityDose' && addMedicineForm[element] == ''){
          formOk = false;
        }
        if(element == 'unitiyDose' && addMedicineForm[element] == ''){
          formOk = false;
        }
        if(element == 'dateStart' && addMedicineForm[element] == ''){
          formOk = false;
        }
      }
    });
 
    let countHoursRecordatory = 0;
    let countTime = 0;
    for(var i = 0; i < this.hoursRecordatory.length; i++){
      if(this.hoursRecordatory[i] != "-1"){
        countHoursRecordatory = countHoursRecordatory + 1;
      }
      if(this.time[i] != ":"){
        countTime = countTime + 1;
      }
    }

    if(countHoursRecordatory != countTime){
      formOk = false;
    }
    
    if(specificDay == null){
      specificDay = true;
    }

    if(formOk == false || !specificDay){
      formOk = false;
      const dialogRef = this.dialog.open(ErrorAddMedicine, {
        width: '250px'
      });
    }
    
   
    return formOk;
  }
}

@Component({
  selector: 'error-addMedicine',
  templateUrl: 'error-addMedicine.html',
})
export class ErrorAddMedicine {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
