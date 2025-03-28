import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-voted-polls',
  imports: [CommonModule, NgxPaginationModule], // Add NgxPaginationModule
  templateUrl: './voted-polls.component.html',
  styleUrls: ['./voted-polls.component.css']
})
export class VotedPollsComponent {
  myPolls: any[] = [];
  votedChoiceIds: number[] = [];
  voters: any[] = [];
  showVotesModal = false;

  apiUrl = 'http://localhost:8080/poll/voted-polls';
  votesApiUrl = 'http://localhost:8080/poll/getusers';
  userVotesApiUrl = 'http://localhost:8080/poll/voted-choices';

  // Pagination properties
  currentPage = 1;
  pollsPerPage = 2;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.getMyPolls();
  }

  getMyPolls() {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user) {
      alert('Please log in to view your polls.');
      return;
    }

    this.http.get(`${this.apiUrl}/${user.id}`).subscribe({
      next: (pollData: any) => {
        this.myPolls = pollData;

        // Fetch user's voted choices
        this.http.get(`${this.userVotesApiUrl}/${user.id}`).subscribe({
          next: (votedData: any) => {
            this.votedChoiceIds = votedData;

            // Merge data to mark voted choices
            this.myPolls = this.myPolls.map(poll => ({
              ...poll,
              choices: poll.choices.map((choice: any) => ({
                ...choice,
                isVotedByUser: this.votedChoiceIds.includes(choice.id)
              }))
            }));
          },
          error: (error) => {
            console.error('Error fetching user votes:', error);
          }
        });

      },
      error: (error) => {
        console.error('Error fetching your polls:', error);
      }
    });
  }

  pollAnalysis(pollId: number) {
    this.router.navigate(['/dashboard/poll-analysis', pollId]);
  }
}
