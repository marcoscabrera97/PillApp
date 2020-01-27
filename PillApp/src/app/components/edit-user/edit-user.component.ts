import { Component, OnInit } from '@angular/core';
import { ServiceFirebaseService } from '../../services/service-firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../components/crear-cuenta/usuario.module';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  public user;
  public editUserForm;
  private idUser;
  public typeUser;
  public showCip: boolean;
  public isDoctor: boolean;
  public hospitals;
  public hospital;

  constructor(private service: ServiceFirebaseService, private activatedRouter: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) { 
    this.buildFormEmpty();
    this.activatedRouter.params.subscribe(params =>{
      this.idUser = params['id'];
      this.typeUser = localStorage.getItem('typeUser');
      this.service.getSpecificUser(this.idUser).subscribe(user => {
        if(localStorage.getItem('typeUser') == 'patient' || localStorage.getItem('typeUser') == 'doctor'){
          this.idUser = localStorage.getItem('token');
        }
        this.getUser(this.idUser);
      })
    })
  }

  ngOnInit() {
  }

  getUser(idUser){
    this.service.getSpecificUser(idUser).subscribe(user => {
      this.user = user;
      if(this.user['userType'] == 'patient'){
        this.showCip = true;
        this.isDoctor = false;
        this.buildFormPatient();
      }else{
        this.showCip = false;
        this.isDoctor = true;
        this.service.getHospitals().subscribe(hospitals => {
          this.hospitals = new Array();
          Object.keys(hospitals).forEach(hospital => {
            hospitals[hospital]['id'] = hospital;
            this.hospitals.push(hospitals[hospital]);
          });
          this.service.getHospital(this.user.id_hospital).subscribe(hospital =>{
            this.hospital = hospital;
            this.hospital['id'] = this.user.id_hospital; 
            this.buildFormDoctor();
          });
        });
      }
        
    });
  }

  buildFormEmpty(){
    this.editUserForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      cip: ['', Validators.required],
      email: ['', Validators.required],
      especialidad: ['', Validators.required],
      planta: ['', Validators.required],
      puerta: ['', Validators.required],
      id_hospital: ['', Validators.required],
      userType: ['']
    });
  }

  buildFormDoctor(){
    this.editUserForm = this.formBuilder.group({
      username: [this.user.username, Validators.required],
      password: [this.user.password, Validators.required],
      name: [this.user.name, Validators.required],
      surname: [this.user.surname, Validators.required],
      cip: [this.user.cip, Validators.required],
      email: [this.user.email, Validators.required],
      especialidad: [this.user.especialidad, Validators.required],
      planta: [this.user.planta, Validators.required],
      puerta: [this.user.puerta, Validators.required],
      id_hospital: [this.hospital, Validators.required],
      userType: [this.user.userType]
    });
  }

  buildFormPatient(){
    this.editUserForm = this.formBuilder.group({
      username: [this.user.username, Validators.required],
      password: [this.user.password, Validators.required],
      name: [this.user.name, Validators.required],
      surname: [this.user.surname, Validators.required],
      cip: [this.user.cip, Validators.required],
      email: [this.user.email, Validators.required],
      userType: [this.user.userType]
    });
  }

  displayFn(hospital?): string | undefined {    
    return hospital ? hospital['nombre_hosp'] : undefined;
  }

  updateUser(){
    const editUserForm = this.editUserForm.value;
    if(this.user['userType'] == 'doctor'){
      if(this.hospital == undefined){
        editUserForm['id_hospital'] = this.hospital['id'];     
      }else{
        editUserForm['id_hospital'] = editUserForm.id_hospital['id'];       
      }
    }
    this.service.updateUser(this.idUser, editUserForm).subscribe(resp => {
      if(this.typeUser == 'patient'){
        this.router.navigate(['home']);
      }else if(this.typeUser == 'doctor'){
        this.router.navigate(['homeDoctor']);
      }else{
        this.router.navigate(['homeAdmin']);
      }
    });
  }

}
