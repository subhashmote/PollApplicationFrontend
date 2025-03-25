import { Component, OnInit } from '@angular/core';
import { PollserviceService } from '../services/pollservice.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-expired-polls',
  imports: [CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './expired-polls.component.html',
  styleUrl: './expired-polls.component.css'
})
export class ExpiredPollsComponent implements OnInit {
  expiredPolls: any[] = [];
  page: number = 1;

  constructor(private pollservice: PollserviceService) {}

  ngOnInit(): void {
    this.getExpiredPolls();
  }

  getExpiredPolls() {
    this.pollservice.getExpiredPolls().subscribe((data: any) => {
      this.expiredPolls = data;
    });
  }

  getVotePercentage(votes: number): number {
    if (!votes) return 0;
    const totalVotes = this.expiredPolls.reduce((sum, poll) => sum + this.getTotalVotes(poll.choices), 0);
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  }

  getTotalVotes(choices: any[]): number {
    return choices.reduce((sum, choice) => sum + choice.voteCount, 0);
  }

  getMostVotedOption(choices: any[]): any[] {
    if (!choices.length) return [];
    const maxVotes = Math.max(...choices.map(choice => choice.voteCount || 0));
    return choices.filter(choice => choice.voteCount === maxVotes);
  }
}
