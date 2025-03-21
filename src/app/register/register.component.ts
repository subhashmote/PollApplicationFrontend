import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule,CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,private authservice:AuthserviceService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName:['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  onSubmit() {
    this.authservice.register(this.registerForm.value).subscribe((data:any)=>{
      // console.log(data);

      if(data.success == true){
        alert("User Registered Successfully,Please Verify Your Account");
        this.router.navigate([`/verify/${data.data.id}`]);
      }
      else{
        alert("Error In Registerting the user");
      }
    })
  }
}
