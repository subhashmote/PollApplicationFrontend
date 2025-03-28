import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PollserviceService {

  constructor(private http:HttpClient) { }

  apiUrl = "http://localhost:8080/poll";

  // Api call to create the poll 
  createPoll(formData:object){
   return this.http.post(`${this.apiUrl}/create`,formData);
  }
  
  // api call to get the single poll information
  getPoll(pollId:number){
    return this.http.get(`${this.apiUrl}/getpoll/${pollId}`);
  }

  // api to get the voters voted on choice 
  getVoters(choiceId:number){
    return this.http.get(`${this.apiUrl}/getusers/${choiceId}`);
  }

  // api to get all the polls
  getAllPolls(){
    return this.http.get(`${this.apiUrl}/getpolls`);
  }

  // get expired polls
  getExpiredPolls(){
    return this.http.get(`${this.apiUrl}/get-expired-polls`);
  }

  // get the list of choice ids of poll on which user voted 
  getVotedChoicesByPollId(pollId:number,userId:number){
    return this.http.get(`${this.apiUrl}/get-voted-choices/${userId}/${pollId}`);
  }

  // api to delete the votes of the user on poll
  deleteVotesOnPoll(voteData: any) {
    return this.http.request('DELETE', `${this.apiUrl}/delete-vote`, {
      body: voteData,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // api to delete the poll
  deleteMyPoll(pollId:number){
    return this.http.delete(`${this.apiUrl}/delete-my-poll/${pollId}`);
  }
  
}
