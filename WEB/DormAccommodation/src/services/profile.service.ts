import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../app/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = "https://localhost:44372/api/Profiles"

  constructor(private http: HttpClient) {}

  getProfile(userId?: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/${userId}`);
  }

  updateProfile(profileid: string, profile: Profile ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${profileid}`, profile);

  }

  getUserIdFromToken(token: string | null): string | null {
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      return decodedPayload.nameid || decodedPayload.sub || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }}

}

