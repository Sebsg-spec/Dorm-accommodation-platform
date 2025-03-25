import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }


	getUser(): Observable<any> {
		return this.http.get('https://localhost:44372/api/Roles');
	}
}
