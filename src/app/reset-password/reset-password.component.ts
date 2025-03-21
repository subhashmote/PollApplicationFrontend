import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthserviceService } from '../services/authservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports:[CommonModule,FormsModule,RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  userId:number=0;
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router,private authservice:AuthserviceService) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParams['userId']; 
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.authservice.resetPassword(this.userId,this.password).subscribe((data:any)=>{
      console.log(data);

      if(data.status == "success"){
        alert("Password Updated Successfully");
        this.router.navigate(['']);
      }
      else{
        alert("Error in Updating the password");
      }
    })
  }
}
