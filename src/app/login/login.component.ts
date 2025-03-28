import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = ''; // Stores API error messages

  constructor(private fb: FormBuilder, private router: Router, private authservice: AuthserviceService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  onLogin() {
    this.loginError = ''; // Reset error message

    if (this.loginForm.invalid) return;

    this.authservice.login(this.loginForm.value).subscribe({
      next: (data: any) => {
        // console.log(data);
        if (data.status === 200) {
          localStorage.setItem('user', JSON.stringify(data.user));
          alert('Login Successful');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error(error);

        // Handle error response
        if (error.status === 401) {
          this.loginError = 'Invalid Email or Password';
        } else {
          this.loginError = 'Internal Server Error. Please try again later.';
        }
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
