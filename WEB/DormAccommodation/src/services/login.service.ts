import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../app/models/user.model';
import {Login} from '../app/models/login.model';
import {Router} from '@angular/router';
import {Consts} from '../app/utils/Consts';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
              private router: Router) {
  }

  register(user: User): Observable<User[]> {
    return this.http.post<User[]>(Consts.REGISTER, user);
  }

  login(user: Login): Observable<Login[]> {
    return this.http.post<Login[]>(Consts.LOGIN, user)
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }

}
