import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollserviceService } from '../services/pollservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pollanalysis',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pollanalysis.component.html',
  styleUrl: './pollanalysis.component.css'
})
export class PollanalysisComponent implements OnInit {

  poll: any = null;
  pollId: number | null = null;

  dynamicColors: string[] = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#9966ff'];

  constructor(private pollservice: PollserviceService, private route: ActivatedRoute) {}

  ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.pollId = +params['pollId']; // Extract poll ID from route
    console.log("🆔 Extracted pollId:", this.pollId); // Debugging log
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

          data.choices.forEach((choice: any) => {
            choice.showVoters = false;
            choice.votersLoaded = false;
          });

          this.poll = data;
        },
        error: (error) => {
          console.error("❌ Error fetching poll:", error);
        }
      });
    }
  }

    // Toggle the visibility of voters list for the selected choice
    toggleVoters(index: number): void {
      const choice = this.poll.choices[index];
      choice.showVoters=!choice.showVoters;

      // if (this.poll && this.poll.choices[index]) {
      //   this.poll.choices[index].showVoters = !this.poll.choices[index].showVoters;
      // }
      if (choice.showVoters && !choice.votersLoaded){
        this.pollservice.getVoters(choice.id).subscribe({
          next:(data :any)=>{
            choice.voters=data;
            choice.votersLoaded =true;
          },
          error:(error)=>{
            console.log("error fetching voters: ",error);
          }
        })
      }
    }


  // Calculate vote percentage for a given choice's vote count
  getVotePercentage(votes: number): number {
    if (!this.poll || !this.poll.choices.length) return 0;
    const totalVotes = this.poll.choices.reduce((sum: number, choice: any) => sum + choice.voteCount, 0);
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  }

  // Generate the CSS conic-gradient style for the pie chart
  getPieChartStyle(): string {
    if (!this.poll || !this.poll.choices.length) {
      return 'transparent';
    }
    const totalVotes = this.poll.choices.reduce((sum: number, choice: any) => sum + choice.voteCount, 0);
    if (totalVotes === 0) {
      return 'gray';
    }
    
    let gradientSegments: string[] = [];
    let currentPercent = 0;
    
    this.poll.choices.forEach((choice: any, index: number) => {
      const percent = (choice.voteCount / totalVotes) * 100;
      const startPercent = currentPercent;
      currentPercent += percent;
      const color = this.dynamicColors[index % this.dynamicColors.length];
      // Ensure percentages are formatted correctly (with two decimal places for clarity)
      gradientSegments.push(`${color} ${startPercent.toFixed(2)}% ${currentPercent.toFixed(2)}%`);
    });
    
    return `conic-gradient(${gradientSegments.join(', ')})`;
  }
  
}