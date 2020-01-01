import { Component, OnInit, Inject } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  quantity: number;
}

@Component({
  selector: 'app-lista-medicamentos',
  templateUrl: './lista-medicamentos.component.html',
  styleUrls: ['./lista-medicamentos.component.scss']
})
export class ListaMedicamentosComponent implements OnInit {

  public medicines;
  public quantity: number;

  constructor(private service: ServiceFirebaseService, private dialog: MatDialog) { 
    this.medicines = new Array();
    this.getMedicines();
  }
  ngOnInit() {
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
