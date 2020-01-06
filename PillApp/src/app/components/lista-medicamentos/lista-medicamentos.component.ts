import { Component, OnInit, Inject } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  quantity: number;
}

export interface DialogData {
  idMedicine: number;
  index: number;
}

@Component({
  selector: 'app-lista-medicamentos',
  templateUrl: './lista-medicamentos.component.html',
  styleUrls: ['./lista-medicamentos.component.scss']
})
export class ListaMedicamentosComponent implements OnInit {

  public medicines;
  public quantity: number;
  hideMatFormField: boolean;

  constructor(private service: ServiceFirebaseService, private dialog: MatDialog) { 
    this.medicines = new Array();
    this.getMedicines();
  }
  ngOnInit() {
    this.service.openMenuVar$.subscribe(openMenu => {
      if(openMenu){
        this.hideMatFormField = true;
      }else{
        this.hideMatFormField = false;
      }
    });
  }

  getMedicines(){
    this.service.getMedicines().subscribe(medicines => {
      Object.keys(medicines).forEach(medicine => {
        if(medicines[medicine].idUser == this.service.userToken){
          this.medicines.push(medicines[medicine]);
        }
      });
      console.log(this.medicines);
    })
  }

  openPopUpQuantity(idMedicine: number, indexList: number){
    const dialogRef = this.dialog.open(EditQuantityMedicine, {
      width: '250px',
      data: {quantity: this.quantity}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined && result != null){
        this.quantity = result;
      }
      this.service.getMedicine(idMedicine).subscribe(medicine => {
        medicine['quantity'] = result;
        if(result != undefined && result != null){
          this.medicines[indexList]['quantity'] = result;
        }
        this.service.updateMedicine(medicine, idMedicine).subscribe();
      });
    });

  }

  deleteRecordatory(idMedicine:number, index: number){
    var result;
    const dialogRef = this.dialog.open(DeleteMedicineWarning,{
      width: '250px',
      data: {idMedicine: idMedicine, index: index}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'delete'){
        this.medicines.splice(index, 1);
      }
    });
  }

  
}

@Component({
  selector: 'pop-up-quantity',
  templateUrl: 'pop-up-quantity.html',
})
export class EditQuantityMedicine {

  constructor(
    public dialogRef: MatDialogRef<EditQuantityMedicine>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'delete-medicine-warning',
  templateUrl: 'delete-medicine-warning.html',
})
export class DeleteMedicineWarning {

  constructor(
    public dialogRef: MatDialogRef<DeleteMedicineWarning>, private service: ServiceFirebaseService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  acceptDeleteMedicine(idMedicine:number, index:number){
    console.log(idMedicine);
    console.log(index);
    this.service.getMedicines().subscribe(medicines => {
      Object.keys(medicines).forEach(medicine => {
        if(medicines[medicine].idMedicine == idMedicine){
          this.service.deleteMedicine(idMedicine).subscribe();
          //this.medicines.splice(index, 1);
          this.service.getRecordatories().subscribe(recordatories => {
            Object.keys(recordatories).forEach(recordatory =>{
              if(recordatories[recordatory].idMedicine == idMedicine){
                this.service.deleteRecordatory(recordatory).subscribe();
              }
            })
          })
        }
      })
    })
    this.dialogRef.close('delete');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
