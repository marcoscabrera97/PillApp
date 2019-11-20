import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendPushNotifactionService {

  private url: string = "https://fcm.googleapis.com/fcm/send";
  private keyFireBase: string = "AAAAxu0I5Tw:APA91bHphO40O8dyVURZhBDyPPOLyUhEfC3j6GlY91DSxdy7FujWtUT2gey_PJurhyAbJJlHLqLfnmZjjMRZeCyrx5-_9vhMnEd6Rwe5Lb1cAHWMgFDHF6d6dL23Q0oWw6KDB9pA3wQv";
  token: string;
  titleRecordatory: string;
  descriptionRecordatory: string;
  medicineName: string;
  constructor(private http: HttpClient) { }

  sendPostRequest() {
    const headers = new HttpHeaders()
    .set('Authorization', 'key='+this.keyFireBase)
    .set('Content-Type', 'application/json');

    const body = {
      "notification": {
        "title": this.medicineName, 
        "body": this.descriptionRecordatory
       },
       "to" : this.token
      }

      return this.http
          .post(this.url, body, {headers: headers})
          .subscribe(res => console.log(res));
    }

    sendBuyMedicine(){
      const headers = new HttpHeaders()
        .set('Authorization', 'key='+this.keyFireBase)
        .set('Content-Type', 'application/json');

      const body = {
        "notification": {
          "title": "Recuerda reponer el medicamento", 
          "body": "Recuerda reponer el medicamento "+this.medicineName+" se esta agotando"
        },
        "to" : this.token
      }
      return this.http
        .post(this.url, body, {headers: headers})
        .subscribe(res => console.log(res));
    }

    sendDateRecordatory(dateDate, nombreHospital){
      const headers = new HttpHeaders()
        .set('Authorization', 'key='+this.keyFireBase)
        .set('Content-Type', 'application/json');
      const body = {
        "notification": {
          "title": "Próxima cita el día "+dateDate, 
          "body": "Recuerda que el día "+dateDate+" tienes cita médica en "+nombreHospital
        },
        "to" : this.token
      }
      return this.http
        .post(this.url, body, {headers: headers})
        .subscribe(res => console.log(res));

    }
  }

