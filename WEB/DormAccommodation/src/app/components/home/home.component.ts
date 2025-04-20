import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Consts} from '../../utils/Consts';
import {ApplicationService} from '../../../services/application.service';
import {UserApplicationDto} from '../../models/user.application.dto';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  activeTab: 'your-applications' | 'history' = 'your-applications';
  public history: UserApplicationDto[] = [];
  public openApplications: UserApplicationDto[] = [];
  public showWhat = Consts.APPLICATIONS_LOADING;
  protected readonly Consts = Consts;

  constructor(private router: Router,
              private applicationService: ApplicationService) {
  }

  ngOnInit(): void {
    this.applicationService.getUserApplications().subscribe(
      (res) => {
        console.log(`APPLICATIONS:`, res)
        if (res === null || res.length === 0) {
          this.showWhat = Consts.APPLICATIONS_OPEN_NONE_REGISTERED;
        } else {
          this.showWhat = Consts.APPLICATIONS_OPEN_REGISTERED_ALREADY;

          // Everything that is 'Cămin acceptat' or 'Cămin refuzat' goes to history
          this.openApplications = res.filter(app => app.status.id !== 5 && app.status.id !== 7);
          this.history = res.filter(app => app.status.id === 5 || app.status.id === 7);
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

  GoToApplicationDetails(applicationId: number) {
    this.router.navigate(['application-details', applicationId]);
  }
}
