import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DormPreference } from '../app/models/dormPreference';
import {Consts} from '../app/utils/Consts';

@Injectable({
  providedIn: 'root'
})
export class DormPreferenceService {


  constructor(private http: HttpClient) { }

  getDormPreferences(): Observable<DormPreference[]> {
    return this.http.get<DormPreference[]>(Consts.DORM_PREFERENCES);
  }

  getDormPreferenceById(id: number): Observable<DormPreference> {
    return this.http.get<DormPreference>(`${Consts.DORM_PREFERENCES}/${id}`);
  }

  postDormPreferences(dormPreferences: DormPreference[]): Observable<DormPreference[]> {
    return this.http.post<DormPreference[]>(`${Consts.DORM_PREFERENCES}/multiple`, dormPreferences);
  }

  updateDormPreference(id: number, pref: DormPreference): Observable<void> {
    return this.http.put<void>(`${Consts.DORM_PREFERENCES}/${id}`, pref);
  }

  deleteDormPreference(id: number): Observable<void> {
    return this.http.delete<void>(`${Consts.DORM_PREFERENCES}/${id}`);
  }
}
