import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Orphonage } from '../_models/Orphonage';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class OrphonageService {
  constructor(private http: HttpClient) { }
  orphonage: Orphonage = new Orphonage();
  getAllOrphonage(): Observable<any> {
    return this.http.get(environment.AUTH_API + '/orphanages');
  }

  addOrphonage(data: any): Observable<any> {
    return this.http.post(environment.AUTH_API + '/orphanages', data);
  }

  getOrphonage(id: any): Observable<any> {
    return this.http.get(environment.AUTH_API + '/orphanages/' + id, httpOptions);
  }

  updateOrphonage(data: any): Observable<any> {
    return this.http.put(environment.AUTH_API + '/orphanage/' + data.id, data, httpOptions);
  }

  deletteOrphonage(data: any): Observable<any> {
    return this.http.delete(environment.AUTH_API + '/orphanage/' + data, httpOptions);
  }

  image_upload(data: any): Observable<any> {
    return this.http.post(environment.AUTH_API + '/image_upload', data);
  }

  affectPicOrphanage(id: any, photo: any): Observable<any> {
    return this.http.put(environment.AUTH_API + '/orphanage/' + id, photo);
  }

  orphanage_donations(orphanage: any) {
    return this.http.get(environment.AUTH_API + '/orphanage_donations/' + orphanage.id, httpOptions);
  }

  deleteImageLink(id: any, new_id_data: any): Observable<any> {
    //Updated orphanage's details after having clicked on picture to delete  
    //console.log(id);
    //console.log(new_id_data);
    return this.http.put(environment.AUTH_API + '/orphanage/' + id, new_id_data);
  }

  deleteImage(filepath: string) {
    //Delete picture file on the server
    //console.log(filepath);
    let json = { "filepath": filepath };
    return this.http.post(environment.AUTH_API + '/image_delete', json);
  }

}