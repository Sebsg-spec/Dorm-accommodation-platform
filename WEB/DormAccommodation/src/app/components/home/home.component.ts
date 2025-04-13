import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Consts} from '../../utils/Consts';
import {ApplicationService} from '../../../services/application.service';
import {UserApplicationDto} from '../../models/user.application.dto';
import {Status} from '../../models/status.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  activeTab: 'your-applications' | 'history' = 'your-applications';
  public history: UserApplicationDto[] = [];
  public userCurrentApplicationDto: UserApplicationDto = new UserApplicationDto(0, "???", "???", "???",
    0, new Date(), new Status(0, ""), "??", 0, new Map())
  public showWhat = Consts.APPLICATIONS_CLOSED;
  protected readonly Consts = Consts;

  constructor(private router: Router,
              private applicationService: ApplicationService) {
  }

  ngOnInit(): void {

    this.applicationService.getUserApplications().subscribe(
      (res) => {
        console.log(`USER APPLICATIONS: ${res}`)
        if (res === null || res.length === 0) {
          this.showWhat = Consts.APPLICATIONS_OPEN_NONE_REGISTERED;
        } else {
          this.showWhat = Consts.APPLICATIONS_OPEN_REGISTERED_ALREADY;
          this.userCurrentApplicationDto = <UserApplicationDto>res.shift();
          this.history = res;
        }
      }, error => {
        alert("Eroare");
      })
  }

  switchTabs() {
    if (this.activeTab === 'your-applications') {
      this.activeTab = 'history';
    } else {
      this.activeTab = 'your-applications';
    }
  }

  GoToDormRegistration() {
    this.router.navigate(['dosar'])
  }


}
