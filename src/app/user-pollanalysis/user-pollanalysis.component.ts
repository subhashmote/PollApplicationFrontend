import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollserviceService } from '../services/pollservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-pollanalysis',
  imports:[CommonModule],
  templateUrl: './user-pollanalysis.component.html',
  styleUrls: ['./user-pollanalysis.component.css']
})
export class UserPollanalysisComponent implements OnInit {
  poll: any = null;
  pollId: number | null = null;

  constructor(private route: ActivatedRoute, private pollservice: PollserviceService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.pollId = Number(params.get('pollId'));
      if (this.pollId) {
        this.getPoll();
      }
    });
  }

  getPoll() {

    if (this.pollId !== null) {
      this.pollservice.getPoll(this.pollId).subscribe({
        next: (data: any) => {
          console.log("✅ Poll Data:", data);
          this.poll = data;
        },
        error: (error) => {
          console.error("❌ Error fetching poll:", error);
        }
      });
    }
  }

 // Calculate vote percentage for a given choice's vote count
 getVotePercentage(votes: number): number {
  if (!this.poll || !this.poll.choices.length) return 0;
  const totalVotes = this.poll.choices.reduce((sum: number, choice: any) => sum + choice.voteCount, 0);
  return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
}

getTotalVotes(): number {
  return this.poll.choices.reduce((sum:any, choice:any)  => sum + choice.voteCount, 0);
}

getMostVotedOption() {
  if (!this.poll || !this.poll.choices || !this.poll.choices.length) {
    console.log('No choices available.');
    return [];
  }
  const maxVotes = Math.max(...this.poll.choices.map((choice:any) => choice.voteCount || 0));
  const mostVoted = this.poll.choices.filter((choice:any) => choice.voteCount === maxVotes);
  console.log('Max votes:', maxVotes, 'Most voted options:', mostVoted);
  return mostVoted;
}
}
