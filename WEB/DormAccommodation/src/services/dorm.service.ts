import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dorm } from '../app/models/dorm.model';

@Injectable({
  providedIn: 'root'
})
export class DormService {
  private apiUrl = "http://localhost:5000/api/Dorms"

  constructor(private http: HttpClient) {}

  getDorms(): Observable<Dorm[]> {
    return this.http.get<Dorm[]>(`${this.apiUrl}/`);
  }

}
