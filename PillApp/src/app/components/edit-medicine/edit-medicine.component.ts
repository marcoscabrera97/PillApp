import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { Recordatorio } from '../add-medicina/recordatorio.module';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';

import {default as _rollupMoment} from 'moment';
import { Medicina } from '../add-medicina/medicina.module';


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
  selector: 'app-edit-medicine',
  templateUrl: './edit-medicine.component.html',
  styleUrls: ['./edit-medicine.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class EditMedicineComponent implements OnInit {


  public editMedicineForm: FormGroup;
  public recordatoryId;
  public time: string [];
  private hoursRecordatory: string[];
  private recordatoryHour;
  public numberDays: boolean;
  public specificDays: boolean;
  public recordatoryAux: Recordatorio;
  public addMedicineForm: FormGroup;
  public medicine: Medicina;
  radioIndefinite: boolean;
  radioNumberDays: boolean;
  radioEveryDay: boolean;
  radioSpecificDays: boolean;
  public idMedicine: number;
  private recordatory: Recordatorio;
  medicamentDose;
  startDate: Date;

  constructor(private atp: AmazingTimePickerService, private activatedRouter: ActivatedRoute, private formBuilder: FormBuilder, private service: ServiceFirebaseService, private router: Router) { 
    this.time = new Array();
    this.medicine = new Medicina();
    this.recordatoryAux = new Recordatorio();
    this.buildForm(null);
    this.activatedRouter.params.subscribe(params =>{
      this.recordatoryId = params['id'];
      this.getRecordatory();
    })
  }

  ngOnInit() {
  }

  buildForm(recordatory) {
    if(recordatory == null){
      this.editMedicineForm = this.formBuilder.group({
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
    }else{
      this.service.getMedicine(recordatory.idMedicine).subscribe(medicine => {
        this.startDate = new Date(recordatory['startDate']);
        if(recordatory['numberDays'] == -1){
          recordatory['numberDays'] = 0;
          this.radioIndefinite = true;
          this.radioNumberDays = false;
          this.numberDays = false;
        }else{
          this.radioIndefinite = false;
          this.radioNumberDays = true;
          this.numberDays = true;
        }

        if(recordatory['daysWeek'].indexOf(-1) != -1){
          this.radioEveryDay = true;
          this.radioSpecificDays = false;
          this.specificDays = false;
        }else{
          this.radioEveryDay = false;
          this.radioSpecificDays = true;
          this.specificDays = true;
        }
        this.editMedicineForm = this.formBuilder.group({
          nameMedicine: [medicine['name'], Validators.required],
          quantity: [medicine['quantity'], Validators.required],
          quantityDose: [medicine['quantityDose'], Validators.required],
          unityDose: [medicine['unityDose'], Validators.required],
          selectTimeHour0: [recordatory['hour'], Validators.required],
          dateStart: [this.startDate, Validators.required],
          numberDaysInput: [recordatory['numberDays'], Validators.required],
          monday: [recordatory['daysWeek'][0], Validators.required],
          thursday: [recordatory['daysWeek'][1], Validators.required],
          wednesday: [recordatory['daysWeek'][2], Validators.required],
          tuesday: [recordatory['daysWeek'][3], Validators.required],
          friday: [recordatory['daysWeek'][4], Validators.required],
          saturday: [recordatory['daysWeek'][5], Validators.required],
          sunday: [recordatory['daysWeek'][6], Validators.required]
        });
      });
    }
    
  }

  getRecordatory(){
    this.service.getRecordatory(this.recordatoryId).subscribe(recordatory => {
      this.recordatoryHour = recordatory['hour'];
      this.idMedicine = recordatory['idMedicine'];
      this.time.push(recordatory['hour']);
      this.buildForm(recordatory);
    })
  }

  open(id) {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.time[id] = time;
      this.recordatoryHour = time;
    });
  }

  selectDose(dose){
    this.medicamentDose = dose;
  }

  showNumberDaysInput(inputSelectDays) {
    if(!inputSelectDays) {
      this.numberDays = false;
      this.recordatoryAux.numberDays = -1;
      //OJOOOOOO
      const editMedicineForm = this.editMedicineForm.value;
      editMedicineForm.numberDaysInput = '';
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

  updateRecordatory() {
    const editMedicineForm = this.editMedicineForm.value;
    console.log(editMedicineForm);
    this.medicine.name = editMedicineForm.nameMedicine;
    this.medicine.quantity = editMedicineForm.quantity;
    this.medicine.quantityDose = editMedicineForm.quantityDose;
    this.medicine.unityDose = editMedicineForm.unityDose;
    if(editMedicineForm.dateStart['_d'] != undefined) {
      console.log('dentro if');
      this.recordatoryAux.startDate = editMedicineForm.dateStart['_d'].toUTCString();
      console.log(this.recordatoryAux.startDate);
    }else{
      console.log('dentro else');
      this.recordatoryAux.startDate = editMedicineForm['dateStart'];
      console.log(this.recordatoryAux.startDate);
    }
    if(editMedicineForm.numberDaysInput != '' && this.recordatoryAux.numberDays != -1){
      this.recordatoryAux.numberDays = editMedicineForm.numberDaysInput;
    }else if(editMedicineForm.numberDaysInput != '' && this.recordatoryAux.numberDays == -1){
      this.recordatoryAux.numberDays = editMedicineForm.numberDaysInput;
    }
    
    this.recordatoryAux.daysWeek = new Array();

    if(editMedicineForm.sunday == true){
      this.recordatoryAux.daysWeek.push(1);
    }else{
      this.recordatoryAux.daysWeek.push(0);
    }
   
    if(editMedicineForm.monday == true){
      this.recordatoryAux.daysWeek.push(1);
    }else{
      this.recordatoryAux.daysWeek.push(0);
    }

    if(editMedicineForm.thursday == true){
      this.recordatoryAux.daysWeek.push(1);
    }else{
      this.recordatoryAux.daysWeek.push(0);
    }

    if(editMedicineForm.wednesday == true){
      this.recordatoryAux.daysWeek.push(1);
    }else{
      this.recordatoryAux.daysWeek.push(0);
    }

    if(editMedicineForm.tuesday == true){
      this.recordatoryAux.daysWeek.push(1);
    }else{
      this.recordatoryAux.daysWeek.push(0);
    }

    if(editMedicineForm.friday == true){
      this.recordatoryAux.daysWeek.push(1);
    }else{
      this.recordatoryAux.daysWeek.push(0);
    }

    if(editMedicineForm.saturday == true){
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
      this.recordatoryAux.idMedicine = this.idMedicine;
      this.recordatory = new Recordatorio();
      this.recordatory = this.recordatoryAux;
      this.recordatory.hour = this.recordatoryHour;
      this.service.updateRecordatory(this.recordatory, this.recordatoryId).subscribe(recordatory => {
        this.service.updateMedicine(this.medicine, this.recordatory.idMedicine).subscribe(medicine => {
        });
      });
      this.router.navigate(['home']);
    
    
  }

}
