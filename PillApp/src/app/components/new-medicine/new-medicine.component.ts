import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { Medicina } from '../add-medicina/medicina.module';
import { Router } from '@angular/router';




@Component({
  selector: 'app-new-medicine',
  templateUrl: './new-medicine.component.html',
  styleUrls: ['./new-medicine.component.scss']
})
export class NewMedicineComponent implements OnInit {

  public newMedicineForm: FormGroup;
  public medicine: Medicina;
  public medicamentDose;

  constructor(private formBuilder: FormBuilder, private service: ServiceFirebaseService, private router: Router) { 
    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm(){
    this.newMedicineForm = this.formBuilder.group({
      nameMedicine: ['', Validators.required],
      quantityMedicine: ['', Validators.required],
      doseMedicine: ['', Validators.required],
      quantityDose: ['', Validators.required]
    })

  }

  selectDose(unityDose){
    this.medicamentDose = unityDose;
  }

  createMedicine(){
    var medicineFormValues = this.newMedicineForm.value;
    this.medicine = new Medicina();
    this.medicine.name = medicineFormValues.nameMedicine;
    this.medicine.quantity = medicineFormValues.quantityMedicine;
    this.medicine.unityDose = medicineFormValues.doseMedicine;
    this.medicine.quantityDose = medicineFormValues.quantityDose;
    this.medicine.idUser = this.service.userToken;
    this.service.addMedicine(this.medicine).subscribe(idMedicina => {
      this.medicine['idMedicine'] = idMedicina['name'];
      this.service.updateMedicine(this.medicine, idMedicina['name']).subscribe(resp => {
        this.router.navigate(['addMedicine']);
      });
    });
  }

}
