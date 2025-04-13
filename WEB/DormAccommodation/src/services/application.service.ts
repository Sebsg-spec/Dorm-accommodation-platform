
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Consts} from '../utils/Consts';
import { Application } from '../app/models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = "http://localhost:5000/api/Applications"

  constructor(private http: HttpClient) { }
  getByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${Consts.APPLICATIONs_GET}`);
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }

  getApplicationById(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`);
  }

  postApplication(app: Application): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, app);
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


