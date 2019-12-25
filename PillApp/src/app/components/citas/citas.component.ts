import { Component, OnInit } from '@angular/core';
import { ServiceFirebaseService } from 'src/app/services/service-firebase.service';
import undefined from 'firebase/empty-import';
import { SendPushNotifactionService } from 'src/app/services/send-push-notifaction.service';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss']
})
export class CitasComponent implements OnInit {

  public datesPatient;
  public idDate;
  private datesSendPush;

  constructor(public service: ServiceFirebaseService, public sendPushService: SendPushNotifactionService) { 
    this.getDatesPatient();
    setInterval(() => {
      this.sendDateRecordatory();
    }, 60000);
  }

  ngOnInit() {
  }

  getDatesPatient(){
    this.datesSendPush = new Array();
    var currentMonth: string[] = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Agost", "Sept", "Oct", "Nov", "Dic"];  
    this.datesPatient = new Array();
    this.service.getDatesPatient().subscribe(dates => {
      this.service.getHospitals().subscribe(hospitals =>{
        console.log(dates);
        Object.keys(dates).forEach(date => {
          console.log(date);
          if(dates[date] != null){
            console.log(dates[date].cip);
            this.service.getSpecificUser(this.service.userToken).subscribe(user => {
              console.log(user);
              if(dates[date].cip == user['cip']) {
              console.log('dentro');
              this.idDate = date;
              console.log(dates[date]);
              const dateDate = new Date(dates[date].fecha);
              const dateAux = new Date(dates[date].fecha);
              dateAux.setDate(dateAux.getDate()- 1);
              const dateAuxStr = dateAux.getDate()+'/'+dateAux.getMonth()+'/'+dateAux.getFullYear(); 
              const actualDateStr = this.service.actualDate.getDate()+'/'+this.service.actualDate.getMonth()+'/'+this.service.actualDate.getFullYear();
              if(dateAuxStr == actualDateStr) {
                this.datesSendPush.push(dates[date]);
              } 

              dates[date].fecha = dateDate.getDate()+' '+currentMonth[dateDate.getMonth()]+', '+dateDate.getFullYear();
              
              if(dateDate.getHours() < 10 && dateDate.getMinutes() <10){
                dates[date].hour = '0'+dateDate.getHours()+':0'+dateDate.getMinutes()+'h';
              }else if(dateDate.getHours() < 10){
                dates[date].hour = '0'+dateDate.getHours()+':'+dateDate.getMinutes()+'h';
              }else if(dateDate.getMinutes() <10){
                dates[date].hour = dateDate.getHours()+':0'+dateDate.getMinutes()+'h';
              }else{
                dates[date].hour = dateDate.getHours()+':'+dateDate.getMinutes()+'h';
              }
              dates[date].nombre_hospital = hospitals[dates[date].id_hospital].nombre_hosp;
              this.datesPatient.push(dates[date]);
              }
            })
          }
        });
            
      });
    })
  }
    

  sendDateRecordatory(){
    Object.keys(this.datesSendPush).forEach(idDate =>{
      this.sendPushService.sendDateRecordatory(this.datesSendPush[idDate].fecha, this.datesSendPush[idDate].nombre_hospital);
    })
  }

}
