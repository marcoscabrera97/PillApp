import { Component, OnInit, OnChanges, Input, Inject, PipeTransform, Pipe } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { Recordatorio } from '../add-medicina/recordatorio.module';
import { Medicina } from '../add-medicina/medicina.module';
import { Subscription } from 'rxjs';
import { MessagingService } from 'src/app/services/messaging.service';
import { SendPushNotifactionService } from 'src/app/services/send-push-notifaction.service';
import { DialogOverviewExampleDialog } from '../crear-cuenta/crear-cuenta.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import undefined from 'firebase/empty-import';
import { RecordatorioHistorico } from './recordatorio-historico.module';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public diasSemana;
  public diasMes;
  public showRecordatorios = new Array();
  public medicine: Medicina;
  collapse: boolean[];
  public actualDate;
  private actualDateRef: Subscription = null;
  public medicinesArray;
  public date;
  private recordatoriesUser: Recordatorio[];
  takeRecordatorio: boolean[];
  take: boolean[];
  recordatoryIdHistoric;

  constructor(private service: ServiceFirebaseService, private sendPush: SendPushNotifactionService, public dialog: MatDialog, private activatedRouter: ActivatedRoute, private router: Router) {
    
    this.recordatoryIdHistoric = new Array();
    this.take = new Array();
    this.takeRecordatorio = [];
    var navbar = document.getElementById('navbar');
    navbar.classList.remove('display-none');
    navbar.classList.add('display-block');
    this.diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    this.diasMes = 31;
    this.collapse = new Array(false, false, false);
    this.showRecordatorios = []
    this.recordatoriesUser = new Array();
    
    this.showRecordatories('constructor');
    this.actualDate = this.service.actualDate.toLocaleDateString();
  }

  ngOnInit(){
    this.actualDateRef = this.service.changeDate$.subscribe((resp)  =>{
      this.actualDate = this.service.actualDate.toLocaleDateString();
      this.showRecordatorios = [];
      this.showRecordatories('ngOnInit');
    });
    
    setInterval(() => {
      this.getDate();
      this.checkRecordatories();
    }, 60000);
  }

  getDate(){
    this.date = new Date();
  }

  checkRecordatories(){
    this.service.getMedicines().subscribe(currentMedicines => {
      Object.keys(this.recordatoriesUser).forEach(recordatorio => {
        let currentRecordatory = this.recordatoriesUser[recordatorio];
        let currentHour = this.date.getHours()+":"+this.date.getMinutes();
        let dayOfTheWeek = this.date.getDay();
        if(new Date(currentRecordatory.startDate) <= this.date && (currentRecordatory.numberDays == -1 || currentRecordatory.numberDays > 0) && currentRecordatory.hour == currentHour && (currentRecordatory.daysWeek.indexOf(dayOfTheWeek) != -1 || currentRecordatory.daysWeek.indexOf(-1) == 0)){
          let currentMedicine = currentMedicines[currentRecordatory.idMedicine];
          if(currentMedicine.quantityDose*2 <= currentMedicine.quantity){
            if(currentMedicine.quantity > 0){
              currentMedicine.quantity = currentMedicine.quantity - 1;
              this.service.updateMedicine(currentMedicine, currentRecordatory.idMedicine).subscribe();
            }
          }else{
            this.sendPush.sendBuyMedicine();
          }
          this.sendPush.medicineName = currentMedicine.name;
          this.sendPush.descriptionRecordatory = "Tomar " + currentMedicine.quantityDose+" " + currentMedicine.unityDose;
          this.sendPush.sendPostRequest();
        }
      })
    });
  }

  openCollapse(id) {
    if(this.collapse[id]) {
      this.collapse[id] = false;
    }else{
      this.collapse[id] = true;
    }
  }

  showRecordatories(valor){
    this.service.getMedicines().subscribe(medicines => {
      var medicineIds = [];
      this.medicinesArray = medicines;
      Object.keys(medicines).forEach(medicine => {
        if(medicines[medicine].idUser == this.service.userToken){
          medicineIds.push(medicine);
        }
      });
      this.service.getRecordatories().subscribe(recordatories => {
        Object.keys(recordatories).forEach(recordatory => {
          Object.keys(medicineIds).forEach(medicineId => {
            var idMedicine = medicineIds[medicineId];
            if(recordatories[recordatory].idMedicine == idMedicine){
              let recordatorio = recordatories[recordatory];
              recordatorio.id = recordatory;
              this.recordatoriesUser.push(recordatorio);
              this.medicine = medicines[idMedicine];
              let date = this.service.actualDate;
              let dayOfTheWeek = date.getDay();
              if((recordatorio.daysWeek[dayOfTheWeek] == 1 || recordatorio.daysWeek[0] == -1 ) && new Date(recordatorio.startDate) <= date){
                let dateRecordatorio = date;
                dateRecordatorio.setHours(recordatorio.hour.substring(0,2));
                dateRecordatorio.setMinutes(recordatorio.hour.substring(3,5));
                let dateValueRecordatorio = new Date(dateRecordatorio);
                if(dateValueRecordatorio <= new Date()){
                    this.getRecordatoryHistoric(recordatorio.id, dateValueRecordatorio, recordatorio, this.medicine['name']);
                    recordatorio['take'] = true;
                    console.log('dentro');
                }else{
                  this.showRecordatorios.push(recordatorio);
                }
              }
            }
          })
        })
      });
      if(this.service.fromAddMedicine){   
        this.service.fromAddMedicine = false;   
        window.location.reload();
      } 
    });
  }

  takeMedicine(idRecordatory, recordatory: any,event?: any){
    recordatory['take']= event;
    this.take[idRecordatory] = event;
    this.service.updateRecordatoryHistoric(idRecordatory, recordatory).subscribe();
  }

  getRecordatoryHistoric(idRecordatory, dateValueRecordatorio, recordatorio, nameMedicine){
    this.service.getRecordatoriesHistoric().subscribe(recordatories => {  
      if(recordatories == null){
        let historicRecordatory = new RecordatorioHistorico();
        historicRecordatory.fecha = dateValueRecordatorio;
        historicRecordatory.idRecordatory = idRecordatory;
        historicRecordatory.take = false;
        historicRecordatory.name = nameMedicine;
        historicRecordatory.idUser = this.service.userToken;
        recordatorio['recordatoryHist'] = historicRecordatory;
        recordatorio['take'] = true;
        this.service.addRecordatoryHistoric(historicRecordatory).subscribe(idRecordatoryHistoric => {
          recordatorio['idHistoric'] = idRecordatoryHistoric['name'];
          this.showRecordatorios.push(recordatorio);
          this.recordatoryIdHistoric.push(idRecordatory);
          this.take[idRecordatoryHistoric['name']] = false;

        });
      }else{
        let findHistory = false;
        let count = 0;
        Object.keys(recordatories).forEach(recordatory => {
          dateValueRecordatorio.setSeconds(0);
          let dateRecordatorySelect = new Date(recordatories[recordatory].fecha);
          dateRecordatorySelect.setSeconds(0);
          this.service.actualDate.setSeconds(0);
          
          if(recordatories[recordatory].idRecordatory == idRecordatory && dateRecordatorySelect.toString() == dateValueRecordatorio.toString()){
            findHistory = true;
            recordatorio['idHistoric'] = recordatory;
            recordatorio['recordatoryHist'] = recordatories[recordatory];
            if(recordatories[recordatory].take){
              let recordatorioAux = recordatories[recordatory];
              recordatorioAux.take = true;
              recordatorioAux.take = recordatories[recordatory].take;
              recordatorioAux.userToken = this.service.userToken;
              this.takeRecordatorio[idRecordatory] = true;

              recordatorio['idHistoric'] = recordatory;
              recordatorio['recordatoryHist'] = recordatorioAux;
              this.take[recordatory] = true;
              this.service.updateRecordatoryHistoric(recordatory, recordatorioAux).subscribe();
            }else{
              this.take[recordatory] = false;
              let recordatorioAux = recordatories[recordatory];
              recordatorioAux.take = false;
              recordatorioAux.take = recordatories[recordatory].take;
              recordatorio['idHistoric'] = recordatory;
              recordatorio['recordatoryHist'] = recordatorioAux;
            }
            this.recordatoryIdHistoric.push(idRecordatory);
            this.showRecordatorios.push(recordatorio);
          }
          let length = Object.keys(recordatories).length;
          count = count + 1;
          if(count == length && !findHistory){
            findHistory = true;
            let historicRecordatory = new RecordatorioHistorico();
            historicRecordatory.fecha = dateValueRecordatorio;
            historicRecordatory.idRecordatory = idRecordatory;
            historicRecordatory.take = false;
            historicRecordatory.name = nameMedicine;
            historicRecordatory.idUser = this.service.userToken;
            recordatorio['recordatoryHist'] = historicRecordatory;
            recordatorio['take'] = true;
            this.recordatoryIdHistoric.push(idRecordatory);
            this.service.addRecordatoryHistoric(historicRecordatory).subscribe(idRecordatoryHistoric => {
              recordatorio['idHistoric'] = idRecordatoryHistoric['name'];
              this.showRecordatorios.push(recordatorio);
              this.take[idRecordatoryHistoric['name']] = false;
            });
            
          }
        })
      }
    });
   
  }


  deleteRecordatory(idRecordatory, idMedicine){
    const dialogRef = this.dialog.open(DeleteRecordatory, {
      data: { 
        idRecordatory: idRecordatory,
        idMedicine: idMedicine 
      },
      width: '250px'
    });
  }
}

@Component({
  selector: 'confirm-delete-recordatory',
  templateUrl: 'confirm-delete-recordatory.html',
})
export class DeleteRecordatory {

  idMedicine;
  idRecordatory;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>, public service: ServiceFirebaseService, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) {
      this.idRecordatory = data['idRecordatory'];
      this.idMedicine = data['idMedicine'];
    }

    deleteRecordatory(){
      this.service.deleteRecordatory(this.idRecordatory).subscribe(resp => {
        this.service.deleteMedicine(this.idMedicine).subscribe(resp => {
          this.throwFailSignIn();
        });
      });
      this.service.getRecordatoriesHistoric().subscribe(recordatoryHist => {
        Object.keys(recordatoryHist).forEach(idRecordatorio => {
          if(this.idRecordatory == recordatoryHist[idRecordatorio].idRecordatory){
            this.service.deleteRecordatoryHistoric(idRecordatorio).subscribe();
          }
        });
      });
  }
  throwFailSignIn() {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(DeleteRecordatoryOk, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'deleteRecordatoryOk',
  templateUrl: 'delete-recordatory-ok.html',
})
export class DeleteRecordatoryOk {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
