import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DormPreference } from '../app/models/dormPreference';

@Injectable({
  providedIn: 'root'
})
export class DormPreferenceService {

  private apiUrl = 'http://localhost:5000/api/DormPreferences';

  constructor(private http: HttpClient) { }

  getDormPreferences(): Observable<DormPreference[]> {
    return this.http.get<DormPreference[]>(this.apiUrl);
  }

  getDormPreferenceById(id: number): Observable<DormPreference> {
    return this.http.get<DormPreference>(`${this.apiUrl}/${id}`);
  }

  postDormPreferences(dormPreferences: DormPreference[]): Observable<DormPreference[]> {
    return this.http.post<DormPreference[]>(`${this.apiUrl}/multiple`, dormPreferences);
  }

  updateDormPreference(id: number, pref: DormPreference): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, pref);
  }

  deleteDormPreference(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
