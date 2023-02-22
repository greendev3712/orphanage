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
export class UserService {

  constructor(private http: HttpClient) { }

  getAllusers(): Observable<any> {
    return this.http.get(environment.AUTH_API + '/users', { responseType: 'text' });
  }

  getUser(id:any): Observable<any> {
    return this.http.get(environment.AUTH_API + '/users/'+ id, httpOptions);
  }

  updateUser(data:any): Observable<any> {
    return this.http.put(environment.AUTH_API + '/users/'+data.id, data, httpOptions);
  }

  deletteUser(data:any): Observable<any> {
    return this.http.delete(environment.AUTH_API + '/users/'+data, httpOptions);
  }

 
}
