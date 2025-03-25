import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,private authservice:AuthserviceService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    this.authservice.login(this.loginForm.value).subscribe({
      next: (data: any) => {
        // console.log(data);
        
        if (data.status === 200) {
          localStorage.setItem('user', JSON.stringify(data.user));
          alert("Login Successfully");
          this.router.navigate(['/dashboard']);
        } else if(data.status === 401){
          alert("Invalid Email Or Password");
        }
      },
      error: (error) => {
        console.error(error);
        alert("Internal Server Error");
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword(){
    this.router.navigate(['/forgot-password']);
  }
}
