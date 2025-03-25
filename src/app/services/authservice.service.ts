import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http:HttpClient) { }


  register(registerForm:object){
    return this.http.post("http://localhost:8080/user/register",registerForm);
  }
  
  login(loginForm:object){
    return this.http.post("http://localhost:8080/user/login",loginForm);
  }

  verifyAccount(otp:string,userId:number){
    return this.http.put(`http://localhost:8080/user/verify/${userId}`,{otp});
  }

  resetPassword(userId:number,password:string){
    return this.http.put(`http://localhost:8080/user/reset-password`,{userId,password});
  }

  updateProfile(userId: number, userData: any) {
    return this.http.put(`http://localhost:8080/user/update/${userId}`,userData);
  }

  updatePassword(formData:object){
    return this.http.put(`http://localhost:8080/user/forgot-password`,formData);
  }
}
