import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consts } from '../app/utils/Consts';

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: number;
}

export interface UpdateRoleDto {
  id: number;
  role: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(Consts.USERS);
  }

  updateUserRole(data: UpdateRoleDto): Observable<any> {
    return this.http.patch(Consts.USER_UPDATE_ROLE, data);
  }

  processApplications(): Observable<any> {
    return this.http.post(`${Consts.USERS}/ProcessApplications`, {});
  }
}
