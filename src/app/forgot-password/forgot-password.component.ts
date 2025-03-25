import { Component } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports:[CommonModule,FormsModule,RouterModule,ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})

export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authservice: AuthserviceService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cnfpassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('cnfpassword')?.value ? null : { mismatch: true };
  }

  updatePassword() {
    if (this.forgotForm.invalid) {
      this.errorMessage = "Please fill in all required fields correctly.";
      return;
    }

    this.authservice.updatePassword(this.forgotForm.value).subscribe(
      (response: any) => {
        // console.log(response);
        if (response.status === 200) {
          alert("Password Updated Successfully");
          this.router.navigate(['']); 
        } else if (response.status === 404) {
          alert("User Does Not Exist,Check Your Email");
          this.errorMessage = "User does not exist. Please check your email.";
        } else {
          alert("Something Wen't Wrong");
          this.errorMessage = "Something went wrong. Please try again.";
        }
      },
      (error) => {
        if (error.status === 404) {
          this.errorMessage = "User does not exist.";
        } else if (error.status === 400) {
          this.errorMessage = "Invalid request. Please check your details.";
        } else {
          this.errorMessage = "Server error. Please try again later.";
        }
      }
    );
  }
}
