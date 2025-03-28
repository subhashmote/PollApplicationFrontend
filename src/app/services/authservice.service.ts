import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http: HttpClient) { }

  apiUrl = "http://localhost:8080/user";


  register(registerForm: object) {
    return this.http.post(`${this.apiUrl}/register`, registerForm);
  }

  login(loginForm: object) {
    return this.http.post(`${this.apiUrl}/login`, loginForm);
  }

  verifyAccount(otp: string, userId: number) {
    return this.http.put(`${this.apiUrl}/verify/${userId}`, { otp });
  }

  resetPassword(userId: number, password: string) {
    return this.http.put(`${this.apiUrl}/reset-password`, { userId, password });
  }

  updateProfile(userId: number, userData: any) {
    return this.http.put(`${this.apiUrl}/update/${userId}`, userData);
  }

  updatePassword(formData: object) {
    return this.http.put(`${this.apiUrl}/forgot-password`, formData);
  }

  getOtp(otpForm:object){
    return this.http.post(`${this.apiUrl}/send-forgot-password-otp`,otpForm);
  }

  verifyOtp(verifyForm:object){
    return this.http.put(`${this.apiUrl}/verify-forgotpassword-otp`,verifyForm);
  }
}
