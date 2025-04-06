
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Consts} from '../utils/Consts';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http: HttpClient) { }
  getByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${Consts.APPLICATION_GET_BY_USER_ID}/${userId}`);
  }
}

