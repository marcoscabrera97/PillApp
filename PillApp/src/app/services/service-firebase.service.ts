import { Injectable } from '@angular/core';
import { Usuario } from '../components/crear-cuenta/usuario.module';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { element } from 'protractor';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceFirebaseService {
  username: string;
  url: string = "https://pillapp-11d2f.firebaseio.com/";
  items: Observable<any[]>;
  private usersCollection: AngularFirestoreCollection<Usuario>;

  constructor(private http: HttpClient, private afs: AngularFirestore) { }

  addUser(user: Usuario) {
    return this.http.post(this.url+'/USUARIO.json', user);
  }

  getUser() {
    return this.http.get(this.url+'/USUARIO.json');//.pipe(map(this.createArrayUsers));
  }

}
