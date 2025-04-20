import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../app/models/profile.model';
import {Consts} from '../app/utils/Consts';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) {}

  getProfile(userId?: string): Observable<Profile> {
    return this.http.get<Profile>(`${Consts.USER_PROFILE}/${userId}`);
  }

  updateProfile(profileid: string, profile: Profile ): Observable<any> {
    return this.http.put(`${Consts.USER_PROFILE}/${profileid}`, profile);
  }

  getUserProp(prop: string): string | null {
    const token = sessionStorage.getItem("Key");
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      return decodedPayload[prop] || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
}

