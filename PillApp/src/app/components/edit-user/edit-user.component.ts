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
        this.buildForm();
      }else{
        this.showCip = false;
        this.isDoctor = true;
        this.service.getHospitals().subscribe(hospitals => {
          this.hospitals = new Array();
          Object.keys(this.hospitals).forEach(hospital => {
            this.hospitals.push(hospital);
          });
          this.service.getHospital(this.user.id_hospital).subscribe(hospital =>{
            this.hospital = hospital;
            this.buildForm();
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
      speciality: ['', Validators.required],
      floor: ['', Validators.required],
      door: ['', Validators.required],
      hospital: ['', Validators.required],
      userType: ['']
    });
  }

  buildForm(){
    this.editUserForm = this.formBuilder.group({
      username: [this.user.username, Validators.required],
      password: [this.user.password, Validators.required],
      name: [this.user.name, Validators.required],
      surname: [this.user.surname, Validators.required],
      cip: [this.user.cip, Validators.required],
      email: [this.user.email, Validators.required],
      speciality: [this.user.especialidad, Validators.required],
      floor: [this.user.planta, Validators.required],
      door: [this.user.puerta, Validators.required],
      hospital: [this.hospital.nombre_hosp, Validators.required],
      userType: [this.user.userType]
    });
  }

  updateUser(){
    const editUserForm = this.editUserForm.value;
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
