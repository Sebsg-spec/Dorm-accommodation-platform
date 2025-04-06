import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  private apiUrl = 'https://localhost:44372/api/Faculties'

  constructor(private http: HttpClient) { }

  getFaculties(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(this.apiUrl);
  }
}