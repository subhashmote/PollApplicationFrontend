import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-verifyotp',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './verifyotp.component.html',
  styleUrl: './verifyotp.component.css'
})
export class VerifyotpComponent {
  otp: string = '';
  userId: number = 0;

  constructor(private route: ActivatedRoute,private authservice:AuthserviceService,private router:Router) {}

  ngOnInit() {
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    this.userId = userIdParam ? Number(userIdParam) : 0; 
    console.log('User ID:', this.userId);
  }
  

  verifyOtp(){
    this.authservice.verifyAccount(this.otp,this.userId).subscribe((data:any)=>{
      console.log(data);

      if(data.status == "success"){
        alert("Account Verified Successfully,Reset Password Link Will Be Sent To Your Email");
        this.router.navigate(['']);
      }
      else {
        alert("Incorrect OTP, Please check OTP again");
      }
    })
  }
}
