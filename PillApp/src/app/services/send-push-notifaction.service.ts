import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendPushNotifactionService {

  url: string = "https://fcm.googleapis.com/fcm/send";
  token: string;
  constructor(private http: HttpClient) { }

  sendPostRequest() {
    console.log('Este es el token de send push' + this.token);
    const headers = new HttpHeaders()
    .set('Authorization', 'key=AAAAxu0I5Tw:APA91bHphO40O8dyVURZhBDyPPOLyUhEfC3j6GlY91DSxdy7FujWtUT2gey_PJurhyAbJJlHLqLfnmZjjMRZeCyrx5-_9vhMnEd6Rwe5Lb1cAHWMgFDHF6d6dL23Q0oWw6KDB9pA3wQv')
    .set('Content-Type', 'application/json');

    const body = {
      "notification": {
        "title": "Hello World", 
        "body": "This is Message from Admin"
       },
       "to" : this.token
      }
      return this.http
          .post(this.url, body, {headers: headers})
          .subscribe(res => console.log(res));
    }
  }

