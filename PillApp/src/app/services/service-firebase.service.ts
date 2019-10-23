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
  apiKey: string = "AIzaSyBHm7eb-O93zxLhUJ8v-VE8zXhBQJlPxcg";
  items: Observable<any[]>;
  userToken: string;
  typeUser: string;

  private usersCollection: AngularFirestoreCollection<Usuario>;

  constructor(private http: HttpClient, private afs: AngularFirestore) { }

  addUser(user: Usuario) {
    return this.http.post(this.url+'/USUARIO.json', user).pipe(
      map(resp => {
        this.saveToken(resp['name']);
        return resp;
      })
    );
  }

  saveToken(idToken: string, typeUser?: string) {
    this.userToken = idToken;
    this.typeUser = typeUser;
    localStorage.setItem('token', idToken);
    localStorage.setItem('typeUser', typeUser);
  }

  isAuthenticated() {
    if(localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
      this.typeUser = localStorage.getItem('typeUser');
    }else{
      this.userToken = null;
    }
    return this.userToken;
  }
  
  getUser() {
    return this.http.get(this.url+'/USUARIO.json');
  }

  deleteUser() {
    localStorage.clear();
  }

}
