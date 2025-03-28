import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { PollserviceService } from '../services/pollservice.service';

@Component({
  selector: 'app-my-polls',
  imports: [CommonModule, FormsModule, RouterModule,NgxPaginationModule],
  templateUrl: './my-polls.component.html',
  styleUrls: ['./my-polls.component.css']
})
export class MyPollsComponent implements OnInit {
  myPolls: any[] = [];
  voters: any[] = [];
  showVotesModal = false;
  apiUrl = 'http://localhost:8080/poll/getmypolls';
  votesApiUrl = 'http://localhost:8080/poll/getusers';

  
  currentPage = 1;
  pollsPerPage = 2;

  constructor(private http: HttpClient, private router: Router,private pollservice:PollserviceService) { }

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
      next: (data: any) => {
        this.myPolls = data;
      },
      error: (error) => {
        console.error('Error fetching your polls:', error);
      }
    });
  }

  pollAnalysis(pollId: number) {
    this.router.navigate(['/dashboard/poll-analysis', pollId]);
  }

  deleteMyPoll(pollId:number){
    this.pollservice.deleteMyPoll(pollId).subscribe((data:any)=>{
      // console.log(data);

      if(data.success){
        alert("Poll Deleted Successfully");
        this.getMyPolls();
      }
      else{
        alert("Error In Deleting the poll");
      }
    }) 
  }
}
