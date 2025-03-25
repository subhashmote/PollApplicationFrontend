import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-polls',
  imports: [FormsModule, CommonModule,NgxPaginationModule,RouterModule],
  templateUrl: './all-polls.component.html',
  styleUrls: ['./all-polls.component.css']
})
export class AllPollsComponent implements OnInit {
  polls: any[] = [];
  selectedChoices: { [pollId: number]: number[] } = {};
  apiUrl = 'http://localhost:8080/poll/getpolls';
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 2; // Number of polls per page

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit() {
    this.getAllPolls();
  }

  getAllPolls() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.polls = data;
      },
      error: (error) => {
        console.error('Error fetching polls:', error);
      }
    });
  }

  toggleChoice(pollId: number, choiceId: number) {
    if (!this.selectedChoices[pollId]) {
      this.selectedChoices[pollId] = [];
    }

    const index = this.selectedChoices[pollId].indexOf(choiceId);
    if (index === -1) {
      this.selectedChoices[pollId].push(choiceId);
    } else {
      this.selectedChoices[pollId].splice(index, 1);
    }
  }

  vote(pollId: number, choiceIds: number[]) {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user) {
      alert('Please log in to vote.');
      return;
    }

    if (choiceIds.length === 0) {
      alert('Please select at least one choice.');
      return;
    }

    const voteData = { pollId, choiceIds, userId: user.id };

    this.http.put('http://localhost:8080/poll/vote', voteData).subscribe({
      next: () => {
        alert('Vote submitted successfully!');
        this.getAllPolls();
        this.selectedChoices[pollId] = [];
      },
      error: (error) => {
        console.error('Error voting:', error);
        alert('Error submitting vote.');
      }
    });
  }


  userPollAnalysis(pollId: number) {
    this.router.navigate(['/dashboard/user-poll-analysis', pollId]);
  }
}
