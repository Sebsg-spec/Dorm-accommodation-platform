import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Consts} from '../app/utils/Consts';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  constructor(private http: HttpClient) { }

  getFaculties(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(Consts.FACULTIES_GET_ALL);
  }
}
