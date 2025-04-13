
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Consts} from '../app/utils/Consts';
import {UserApplicationDto} from '../app/models/user.application.dto';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = "http://localhost:5000/api/Applications"

  constructor(private http: HttpClient) { }
  getUserApplications(): Observable<UserApplicationDto[]> {
    return this.http.get<UserApplicationDto[]>(`${Consts.APPLICATIONS_GET}`);
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


