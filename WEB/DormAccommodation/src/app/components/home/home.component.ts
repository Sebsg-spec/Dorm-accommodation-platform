import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Consts} from '../../../utils/Consts';
import {ApplicationService} from '../../../services/application.service';
import {ProfileService} from '../../../services/profile.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public showWhat = Consts.APPLICATIONS_CLOSED;
  public nrDosar = "???";
  public student = "???";
  public faculty = "???";
  public status = null;
  public status_name = "";

  protected readonly Consts = Consts;

  constructor(private router: Router,
              private applicationService: ApplicationService,
              private userProfileService: ProfileService) { }

  ngOnInit(): void {

    var id = this.userProfileService.getUserIdFromToken(sessionStorage.getItem("Key")) ?? "";
    this.applicationService.getByUserId(id).subscribe((res) => {

      if(res == null) {
        this.showWhat = Consts.APPLICATIONS_OPEN_NONE_REGISTERED;
      } else {
        this.showWhat = Consts.APPLICATIONS_OPEN_REGISTERED_ALREADY;
        this.student = res.studentName;
        this.faculty = res.faculty;
        this.status = res.status;
        this.status_name = res.status.name;
      }
    },error => {

    })
  }

  GoToDormRegistration() {
    this.router.navigate(['dosar'])
  }

  GoToUserProfile() {
    this.router.navigate(['user-profile']);
  }

}
