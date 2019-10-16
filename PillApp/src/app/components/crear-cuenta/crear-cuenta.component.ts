import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.scss']
})
export class CrearCuentaComponent implements OnInit {

  public signUpForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { 
    this.buildForm();
  }

  ngOnInit() {
    var navbar = document.getElementById('navbar');
    navbar.classList.add('display-none');
  }

  private buildForm() {
    this.signUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  register() {
    const userRegister = this.signUpForm.value;
    console.log(userRegister);
  }

}
