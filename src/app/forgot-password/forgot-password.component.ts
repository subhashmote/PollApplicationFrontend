import { Component } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  errorMessage: string = '';
  otpSent: boolean = false;
  otpVerified: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authservice: AuthserviceService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cnfpassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('cnfpassword')?.value ? null : { mismatch: true };
  }

  getOtp() {
    this.errorMessage = '';
    const emailControl = this.forgotForm.get('email')!;

    if (emailControl?.invalid) {
      this.errorMessage = "Please enter a valid email.";
      return;
    }

    this.authservice.getOtp({ email: emailControl.value }).subscribe(
      (data: any) => {
        if (data.status === 200) {
          this.otpSent = true;
          alert("OTP sent successfully to your email.");
        } else {
          this.errorMessage = data.message || "Something went wrong. Please try again.";
        }
      },
      (error) => this.handleError(error)
    );
  }

  verifyOtp() {
    this.errorMessage = '';
    const email = this.forgotForm.get('email')?.value;
    const otp = this.forgotForm.get('otp')?.value;

    if (!otp) {
      this.errorMessage = "Please enter the OTP.";
      return;
    }

    this.authservice.verifyOtp({ email, otp }).subscribe(
      (data: any) => {
        if (data.status === 200) {
          this.otpVerified = true;
          alert("OTP verified successfully.");
        } else {
          this.errorMessage = "Invalid OTP. Please try again.";
        }
      },
      (error) => this.handleError(error)
    );
  }

  updatePassword() {
    this.errorMessage = '';

    if (!this.otpVerified) {
      this.errorMessage = "Please verify OTP before updating the password.";
      return;
    }

    if (this.forgotForm.invalid) {
      this.errorMessage = "Please fill in all required fields correctly.";
      return;
    }

    this.authservice.updatePassword(this.forgotForm.value).subscribe(
      (response: any) => {
        if (response.status === 200) {
          alert("Password Updated Successfully");
          this.router.navigate(['']);
        } else {
          this.errorMessage = response.message || "Something went wrong. Please try again.";
        }
      },
      (error) => this.handleError(error)
    );
  }

  private handleError(error: any) {
    console.error("Error Response:", error);

    this.errorMessage = error.error?.message || this.getDefaultErrorMessage(error.status);
  }

  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 404:
        return "User not found. Please check your email.";
      case 400:
        return "Invalid request. Please check your details.";
      case 500:
        return "Internal server error. Please try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
}
