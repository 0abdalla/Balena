import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild('LoginForm') LoginForm: any;
  isShowPassword = false;
  LoginModel: LoginModel = {} as LoginModel;
  ErrorMessage = '';
  ButtonDisabled = false;
  constructor(private authService: AuthService, private router: Router) {

  }

  Login() {
    this.LoginForm.onSubmit();
    const isValid = this.LoginForm.form.valid;
    if (!isValid)
      return;

    this.ButtonDisabled = true;
    this.authService.AdminLogin(this.LoginModel).subscribe(data => {
      this.ButtonDisabled = false;
      if (data.isSuccess) {
        localStorage.setItem('UserModel', JSON.stringify(data.results));
        this.router.navigateByUrl('/admin');
      } else
        this.ErrorMessage = data.message;
    });
  }
}

export interface LoginModel {
  userName: string,
  password: string,
}
