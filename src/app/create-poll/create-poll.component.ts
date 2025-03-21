import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PollserviceService } from '../services/pollservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, FormsModule],
  templateUrl: './create-poll.component.html',
  styleUrl: './create-poll.component.css'
})
export class CreatePollComponent implements OnInit {
  pollForm: FormGroup;
  userId: number | null = null;  

  constructor(private fb: FormBuilder, private pollservice: PollserviceService, private router: Router) {
    this.pollForm = this.fb.group({
      question: ['', Validators.required],
      choices: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      pollLength: ['', [Validators.required, Validators.min(1)]],
      allowMultipleSelect: [false],  
      createdBy: []
    });
  }

  ngOnInit() {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser.id;
    }
  }

  get choices() {
    return this.pollForm.get('choices') as FormArray;
  }

  addChoice() {
    this.choices.push(this.fb.control('', Validators.required));
  }

  removeChoice(index: number) {
    if (this.choices.length > 2) {
      this.choices.removeAt(index);
    }
  }

  submitPoll() {
    if (this.pollForm.valid) {
      if (!this.userId) {
        alert("User not found. Please log in again.");
        return;
      }

      const formData = {
        question: this.pollForm.value.question,
        choices: this.pollForm.value.choices.map((text: string) => ({ text })),
        pollLength: { hours: this.pollForm.value.pollLength },
        allowMultipleSelect: this.pollForm.value.allowMultipleSelect,  
        createdBy: this.userId  
      };

      this.pollservice.createPoll(formData).subscribe({
        next: (data: any) => {
          console.log(data);
          if (data.status === 201) {
            alert("Poll Created Successfully");
            this.router.navigate(['/dashboard/all-polls']);
          } else {
            alert("Error in Poll Creation");
          }
        },
        error: (error) => {
          console.error("Error in Poll Creation:", error);
          alert("Something went wrong. Please try again.");
        }
      });
    }
  }
}
