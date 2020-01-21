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

  constructor(private service: ServiceFirebaseService, private activatedRouter: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) { 
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
      }else{
        this.showCip = false;
      }
      this.buildForm();
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
