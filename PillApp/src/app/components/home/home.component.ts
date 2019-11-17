import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import { Recordatorio } from '../add-medicina/recordatorio.module';
import { Medicina } from '../add-medicina/medicina.module';
import { Subscription } from 'rxjs';
import { MessagingService } from 'src/app/services/messaging.service';
import { SendPushNotifactionService } from 'src/app/services/send-push-notifaction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public diasSemana;
  public diasMes;
  public showRecordatorios: Recordatorio[];
  public medicine: Medicina;
  collapse: boolean[];
  public actualDate;
  private actualDateRef: Subscription = null;
  public medicinesArray;
  public date;
  private recordatoriesUser: Recordatorio[];


  constructor(private service: ServiceFirebaseService, private sendPush: SendPushNotifactionService) {
    var navbar = document.getElementById('navbar');
    navbar.classList.remove('display-none');
    navbar.classList.add('display-block');
    this.diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    this.diasMes = 31;
    this.collapse = new Array(false, false, false);
    this.showRecordatorios = new Array();
    this.recordatoriesUser = new Array();
    this.showRecordatories();
    this.actualDate = this.service.actualDate.toLocaleDateString();
  }

  ngOnInit() {
    this.actualDateRef = this.service.changeDate$.subscribe((resp)  =>{
      this.actualDate = this.service.actualDate.toLocaleDateString();
      this.showRecordatories();
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
          this.sendPush.titleRecordatory = currentMedicine.name;
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

  showRecordatories(){
    this.showRecordatorios = [];
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
              if((recordatorio.daysWeek[dayOfTheWeek] == 1 || recordatorio.daysWeek[0] == -1 )&& new Date(recordatorio.startDate) <= date){
                this.showRecordatorios.push(recordatorio);
              }
            }
          })
        })
      });
    });
  }

  deleteRecordatory(idRecordatory, idMedicine){
    this.service.deleteRecordatory(idRecordatory).subscribe(resp => {
      this.service.deleteMedicine(idMedicine).subscribe(resp => {
        console.log('mensaje eliminación correcto');
      });
    });
  }
}
