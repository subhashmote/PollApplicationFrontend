import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router, RouterModule } from '@angular/router';
import { PollserviceService } from '../services/pollservice.service';

@Component({
  selector: 'app-all-polls',
  imports: [FormsModule, CommonModule, NgxPaginationModule, RouterModule],
  templateUrl: './all-polls.component.html',
  styleUrls: ['./all-polls.component.css']
})
export class AllPollsComponent implements OnInit {
  polls: any[] = [];
  selectedChoices: { [pollId: number]: number[] } = {};
  apiUrl = 'http://localhost:8080/poll/getpolls';
  choiceIds: any[] = [];
  userVotedChoices: number[] = [];// Stores choices already voted by user
  userVotesApiUrl = 'http://localhost:8080/poll/voted-choices'; // User's voted choices API
  voteForm: any;


  // Pagination properties
  currentPage = 1;
  itemsPerPage = 2; // Number of polls per page


  //sortOption here
  sortOption: string = 'newest';


  constructor(private http: HttpClient, private router: Router, private pollservice: PollserviceService) { }

  ngOnInit() {
    this.getAllPolls();
    this.getUserVotes();
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

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortPolls(selectElement.value);
  }

  sortPolls(option: string) {

    this.sortOption = option;

    switch (option) {

      case 'newest': {
        this.polls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      }
      case 'oldest': {
        this.polls.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      }
      case 'most-popular': {
        this.polls.sort((a, b) => this.getTotalVotes(b) - this.getTotalVotes(a));
        break;
      }
      case 'least-popular': {
        this.polls.sort((a, b) => this.getTotalVotes(a) - this.getTotalVotes(b));
        break;
      }
    }
  }

  getTotalVotes(poll: any): number {
    return poll.choices.reduce((sum: number, choice: any) => sum + choice.voteCount, 0);
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
        this.getUserVotes();
        this.selectedChoices[pollId] = [];
      },
      error: (error) => {
        console.error('Error voting:', error);
        alert('Already Voted On This Poll');
      }
    });
  }



  userPollAnalysis(pollId: number) {
    this.router.navigate(['/dashboard/user-poll-analysis', pollId]);
  }


  removeVotes(pollId: number) {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user) {
      alert('Please log in to remove votes.');
      return;
    }

    const userId = user.id;

    this.pollservice.getVotedChoicesByPollId(pollId, userId).subscribe({
      next: (data: any) => {
        if (!data || data.length === 0) {
          alert("No votes found to remove.");
          return;
        }

        this.choiceIds = data;

        this.voteForm = {
          userId: userId,
          pollId: pollId,
          choiceIds: this.choiceIds
        };

        this.pollservice.deleteVotesOnPoll(this.voteForm).subscribe({
          next: (response: any) => {
            console.log(response);
            if (response.success) {
              alert("Vote Removed Successfully");
              this.getAllPolls(); // Refresh poll list
              this.getUserVotes(); 
            } else {
              alert(response.message || "Error In Removing Votes");
            }
          },
          error: (error) => {
            console.error("Error removing votes:", error);
            alert("Error removing votes.");
          }
        });
      },
      error: (error) => {
        console.error("Error fetching voted choices:", error);
        alert("Failed to fetch voted choices.");
      }
    });
  }


  getUserVotes() {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user) {
      console.warn('user not Logged IN');
      return;
    }


    this, this.http.get<number[]>(`${this.userVotesApiUrl}/${user.id}`).subscribe({

      next: (response) => {
        this.userVotedChoices = response;
      },
      error: (error) => {
        console.error('Error fetching user votes:', error);
      }

    })
  }

  
}
