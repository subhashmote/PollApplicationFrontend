import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PollserviceService {

  constructor(private http:HttpClient) { }


  createPoll(formData:object){
   return this.http.post("http://localhost:8080/poll/create",formData);
  }
  
  getPoll(pollId:number){
    return this.http.get(`http://localhost:8080/poll/getpoll/${pollId}`);
  }

  getVoters(choiceId:number){
    return this.http.get(`http://localhost:8080/poll/getusers/${choiceId}`);
  }

  getAllPolls(){
    return this.http.get(`http://localhost:8080/poll/getpolls`);
  }

  getExpiredPolls(){
    return this.http.get(`http://localhost:8080/poll/get-expired-polls`);
  }
}
