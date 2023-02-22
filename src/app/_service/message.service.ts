import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  getAllmessages(): Observable<any> {
    return this.http.get(environment.AUTH_API + '/messages');
  }

  sendMessage(data:any): Observable<any> {
    return this.http.post(environment.AUTH_API + '/messages', data , httpOptions);
  }
  
  getMessages(page: any, tableSize: any): Observable<any>{
     return this.http.get(environment.AUTH_API + '/messages?page='+page+'&per_page='+tableSize);
  }
}
