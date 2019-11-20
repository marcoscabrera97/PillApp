import { Injectable, Output, SimpleChanges } from '@angular/core';
import { Usuario } from '../components/crear-cuenta/usuario.module';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { element } from 'protractor';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Medicina } from '../components/add-medicina/medicina.module';
import { Recordatorio } from '../components/add-medicina/recordatorio.module';

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
  actualDate;

  private changeDate = new Subject<Date>();
  public changeDate$ = this.changeDate.asObservable();

  constructor(private http: HttpClient, private afs: AngularFirestore) { 
    this.actualDate = new Date();
    console.log(this.actualDate);
  }

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

  addMedicine(medicine: Medicina){
    return this.http.post(this.url+'/MEDICAMENTO.json', medicine).pipe(
      map(resp => {
        //this.saveToken(resp['name']);
        console.log(resp);
        return resp;
      })
    );
  }

  addRecordatory(recordatory: Recordatorio){
    return this.http.post(this.url+'/RECORDATORIO.json', recordatory).pipe(
      map(resp => {
        console.log(resp);
        //this.saveToken(resp['name']);
        return resp;
      })
    );
  }

  getMedicines(){
    return this.http.get(this.url+'/MEDICAMENTO.json');
  }

  getRecordatories(){
    return this.http.get(this.url+'/RECORDATORIO.json');
  }

  setActualDate(actualDate) {
    this.actualDate = actualDate;
    this.changeDate.next();
  }

  getRecordatory(idRecordatory){
    return this.http.get(this.url+'/RECORDATORIO/'+ idRecordatory+'.json');
  }

  getMedicine(idMedicine){
    return this.http.get(this.url+'/MEDICAMENTO/'+ idMedicine+'.json');
  }

  updateRecordatory(recordatory, idRecordatory){
    return this.http.put(this.url+'/RECORDATORIO/'+idRecordatory+'.json', recordatory);
  }

  updateMedicine(medicine, idMedicine){
    return this.http.put(this.url+'/MEDICAMENTO/'+idMedicine+'.json', medicine);
  }

  deleteRecordatory(idRecordatory){
    return this.http.delete(this.url+'/RECORDATORIO/'+idRecordatory+'.json');
  }

  deleteMedicine(idMedicine){
    return this.http.delete(this.url+'/MEDICAMENTO/'+idMedicine+'.json');
  }

  getDatesPatient(){
    return this.http.get(this.url+'/CITA_PACIENTE.json');
  }

  getHospitals(){
    return this.http.get(this.url+'/HOSPITAL.json');
  }

  getDate(idDate){
    return this.http.get(this.url+'/CITA_PACIENTE/'+idDate+'.json');
  }

  getHospital(idHospital){
    return this.http.get(this.url+'/HOSPITAL/'+idHospital+'.json');
  }
}
