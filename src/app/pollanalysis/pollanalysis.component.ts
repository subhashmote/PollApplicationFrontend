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

  dynamicColors: string[] = [
    '#ff6384', // Pinkish red
    '#36a2eb', // Light blue
    '#cc65fe', // Purple
    '#ffce56', // Yellow
    '#4bc0c0', // Teal
    '#9966ff', // Violet
    '#e6194b', // Red
    '#3cb44b', // Green
    '#ffe119', // Mustard yellow
    '#0082c8', // Blue
    '#f58231', // Orange
    '#911eb4', // Dark purple
    '#46f0f0', // Cyan
    '#f032e6', // Magenta
    '#d2f53c', // Lime
    '#fabebe', // Light pink
    '#008080', // Teal (darker)
    '#e6beff', // Lavender
    '#aa6e28', // Brown
    '#fffac8', // Light yellow
    '#800000', // Maroon
    '#aaffc3', // Mint
    '#808000', // Olive
    '#ffd8b1', // Peach
    '#000080', // Navy
    '#808080', // Gray
    '#000000', // Black
    '#d2691e', // Chocolate
    '#b22222', // Firebrick
    '#20b2aa'  // Light sea green
  ];

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