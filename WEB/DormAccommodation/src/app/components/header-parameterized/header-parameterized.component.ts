import {Component, Input, OnInit} from '@angular/core';
import {LoginService} from '../../../services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header-parameterized',
  standalone: false,
  templateUrl: './header-parameterized.component.html',
  styleUrl: './header-parameterized.component.css'
})
export class HeaderParameterizedComponent implements OnInit {

  @Input() hasUserLoginCard: boolean = true;

  public EmailAddress = sessionStorage.getItem("email");

  constructor(private loginService: LoginService,
              private router: Router) {
  }
  ngOnInit(): void {
  }
  Logout() {
    this.loginService.logout();
  }

  GoToUserProfile() {
    this.router.navigate(['user-profile']);
  }
}
