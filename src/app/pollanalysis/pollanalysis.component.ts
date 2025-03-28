import { ChartData } from './../../../node_modules/chart.js/dist/types/index.d';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollserviceService } from '../services/pollservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';

// global chart components
Chart.register(...registerables);

@Component({
  selector: 'app-pollanalysis',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pollanalysis.component.html',
  styleUrl: './pollanalysis.component.css'
})
export class PollanalysisComponent implements OnInit {

  @ViewChild('chartCanvas', {static: false}) chartCanvas!: ElementRef;

  poll: any = null;
  pollId: number | null = null;

  chart!: Chart;
  chartData: number[]=[];
  chartLabels: string[]=[];
  chartColors: string[]=[];
  
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
         setTimeout(() => {
            this.prepareChartData();
            this.renderChart();
          }, 10);
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

    prepareChartData(){

      if(!this.poll || !this.poll.choices) return;

      this.chartLabels= this.poll.choices.map((choice: any) => choice.text);
      this.chartData = this.poll.choices.map((choice:any)=> choice.voteCount);
      this.chartColors =[];
    }

    renderChart(){

      if(this.chart){
        //Destroy existing chart berfore rendering new one
        this.chart.destroy(); 
      }

      if (!this.chartCanvas) {
        console.error('Canvas element not found!');
        return;
      }
      

      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type:'pie',
        data:{
          labels:this.chartLabels,
          datasets:[{
            data: this.chartData,
            // backgroundColor: this.chartColors
          }]
        },
        options: {
          responsive:true,
          maintainAspectRatio: true, 
          plugins : {
            // legend:  { position: 'bottom'},
            legend:{ display:false},
            tooltip: { enabled : true}
          }
        }
      });

      // Extract the auto-generated colors from the chart's dataset meta
      const meta = this.chart.getDatasetMeta(0);
      this.chartColors = meta.data.map(segment => segment.options['backgroundColor']);

      // Log the colors to verify they are set
      console.log("Auto-generated chart colors:", this.chartColors);
    
    }


  // Calculate vote percentage for a given choice's vote count
  getVotePercentage(votes: number): number {
    if (!this.poll || !this.poll.choices.length) return 0;
    const totalVotes = this.poll.choices.reduce((sum: number, choice: any) => sum + choice.voteCount, 0);
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  }
  
}