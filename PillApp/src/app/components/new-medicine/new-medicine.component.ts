import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { Medicina } from '../add-medicina/medicina.module';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';




@Component({
  selector: 'app-new-medicine',
  templateUrl: './new-medicine.component.html',
  styleUrls: ['./new-medicine.component.scss']
})
export class NewMedicineComponent implements OnInit {

  public newMedicineForm: FormGroup;
  public medicine: Medicina;
  public medicamentDose;

  constructor(private formBuilder: FormBuilder, private service: ServiceFirebaseService, private router: Router, private dialog: MatDialog) { 
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

  checkValuesForm(medicineFormValues){
    var error = false;
    Object.keys(medicineFormValues).forEach(value => {
      if(medicineFormValues[value] == ""){
        error = true;
      }
    })
    return error;
  }

  createMedicine(){
    var medicineFormValues = this.newMedicineForm.value;
    var error = this.checkValuesForm(medicineFormValues);
    if(!error){
      this.medicine = new Medicina();
      this.medicine.name = medicineFormValues.nameMedicine;
      this.medicine.quantity = medicineFormValues.quantityMedicine;
      this.medicine.unityDose = medicineFormValues.doseMedicine;
      this.medicine.quantityDose = medicineFormValues.quantityDose;
      this.medicine.idUser = this.service.userToken;
      this.service.getMedicines().subscribe(medicines => {
        var medicineExist = false;
        Object.keys(medicines).forEach(medicine => {
          if(medicines[medicine].idUser == this.service.userToken && medicines[medicine].name == this.medicine.name) {
            medicineExist = true;
          }
        })
        if(!medicineExist) {
          this.service.addMedicine(this.medicine).subscribe(idMedicina => {
            this.medicine['idMedicine'] = idMedicina['name'];
            this.service.updateMedicine(this.medicine, idMedicina['name']).subscribe(resp => {
              this.router.navigate(['addMedicine']);
            });
          });
        }else{
          const dialogRef = this.dialog.open(MedicineExist, {});
        }
      })
    }else{
      const dialogRef = this.dialog.open(EmptyParameters, {});
    }    
  }
}

@Component({
  selector: 'medicineExist',
  templateUrl: 'medicineExist.html',
})
export class MedicineExist {

  constructor(
    public dialogRef: MatDialogRef<MedicineExist>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'emptyParameters',
  templateUrl: 'emptyParameters.html',
})
export class EmptyParameters {

  constructor(
    public dialogRef: MatDialogRef<EmptyParameters>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
