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
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(environment.AUTH_API + '/tokens', {
      username,
      password
    }, httpOptions);
  }

  register(user:any): Observable<any> {
    return this.http.post(environment.AUTH_API + '/users', user , httpOptions);
  }
}
