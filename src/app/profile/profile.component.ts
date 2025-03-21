import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userData: any;
  originalData: any;
  isEditing: boolean = false;

  constructor(private authservice: AuthserviceService) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
      this.originalData = { ...this.userData };
    } else {
      console.log("Login First");
    }
  }

  toggleEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.userData = { ...this.originalData };
  }

  updateUser() {
    this.authservice.updateProfile(this.userData.id, this.userData).subscribe(
      (response: any) => {
        if (response.success) {
          this.userData = response.user;

          
          this.originalData = { ...this.userData };

         
          localStorage.setItem('user', JSON.stringify(this.userData));

          alert(response.message);
          this.isEditing = false;
        } else {
          alert("Failed to update profile. Please try again.");
        }
      },
      (error) => {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating the profile.");
      }
    );
  }

}
