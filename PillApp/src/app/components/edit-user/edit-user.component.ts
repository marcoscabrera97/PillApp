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

  constructor(private service: ServiceFirebaseService, private activatedRouter: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) { 
    this.activatedRouter.params.subscribe(params =>{
      this.idUser = params['id'];
      this.getUser(this.idUser);
    })
  }

  ngOnInit() {
  }

  getUser(idUser){
    this.service.getSpecificUser(idUser).subscribe(user => {
      this.user = user;
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
      this.router.navigate(['homeAdmin']);
    });
  }

}
