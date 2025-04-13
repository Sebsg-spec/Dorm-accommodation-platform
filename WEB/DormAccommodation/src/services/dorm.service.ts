import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dorm } from '../app/models/dorm.model';
import {Consts} from '../app/utils/Consts';

@Injectable({
  providedIn: 'root'
})
export class DormService {

  constructor(private http: HttpClient) {}

  getDorms(): Observable<Dorm[]> {
    return this.http.get<Dorm[]>(Consts.DORMS);
  }

}
