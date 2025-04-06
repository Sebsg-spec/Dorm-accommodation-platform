import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../app/models/user.model';
import {Login} from '../app/models/login.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
              private router: Router) {
  }

  private apiUrl = "https://localhost:44372/api/Users"


  register(user: User): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiUrl}/register`, user);
  }

  login(user: Login): Observable<Login[]> {
    return this.http.post<Login[]>(`${this.apiUrl}/login`, user)
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }

}
