import {Component, Input, OnInit} from '@angular/core';
import {LoginService} from '../../../services/login.service';
import {Router} from '@angular/router';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-header-parameterized',
  standalone: false,
  templateUrl: './header-parameterized.component.html',
  styleUrl: './header-parameterized.component.css'
})
export class HeaderParameterizedComponent implements OnInit {

  @Input() hasUserLoginCard: boolean = true;

  public EmailAddress = sessionStorage.getItem("email");
  public userRole: number | null = null;

  constructor(private loginService: LoginService,
              private router: Router,
              private profileService: ProfileService) {
    this.userRole = parseInt(this.profileService.getUserProp("role") ?? "0");
  }
  
  ngOnInit(): void {
  }
  
  Logout() {
    this.loginService.logout();
  }

  GoToUserProfile() {
    this.router.navigate(['user-profile']);
  }
  
  GoToAdmin() {
    this.router.navigate(['admin']);
  }
}
