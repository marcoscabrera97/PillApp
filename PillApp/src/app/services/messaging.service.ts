import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SendPushNotifactionService } from './send-push-notifaction.service';

@Injectable()
export class MessagingService {
    messaging = firebase.messaging();
    currentMessage = new BehaviorSubject(null);
  
    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private sendPush: SendPushNotifactionService) {}
  
    updateToken(token) {
      this.afAuth.authState.take(1).subscribe(user => {
        if (!user) {
          return;
        }
        const data = { [user.uid]: token };
        this.db.object('fcmTokens/').update(data);
      });
    }
  
    getPermission() {
      this.messaging
        .requestPermission()
        .then(() => {
          return this.messaging.getToken();
        })
        .then(token => {
          this.sendPush.token = token;
          this.updateToken(token);
        })
        .catch(err => {
          console.log('Unable to get permission to notify.', err);
        });
    }
  
    receiveMessage() {
      this.messaging.onMessage(payload => {
        this.currentMessage.next(payload);
      });
    }
  
}