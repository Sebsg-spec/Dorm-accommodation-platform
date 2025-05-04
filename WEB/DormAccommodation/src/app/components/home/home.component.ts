import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Consts} from '../../utils/Consts';
import {ApplicationService} from '../../../services/application.service';
import {UserApplicationDto} from '../../models/user.application.dto';
import { ProfileService } from '../../../services/profile.service';

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
  userRole: number | null = null;

  applicationPageSizeOptions = [4, 8, 12];
  applicationPageSize = 4;
  applicationCurrentPage = 1;
  
  constructor(private router: Router,
              private applicationService: ApplicationService,
              private profileService: ProfileService) {
    this.userRole = parseInt(this.profileService.getUserProp("role") ?? "0");
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

  GoToUpdateApplication(applicationId: number) {
    this.router.navigate(['application-update', applicationId]);
  }

  get paginatedApplications() {
    const startIndex = (this.applicationCurrentPage - 1) * this.applicationPageSize;
    return this.openApplications.slice(startIndex, startIndex + this.applicationPageSize);
  }
  
  get applicationTotalPages() {
    return Math.ceil(this.openApplications.length / this.applicationPageSize);
  }
  
  onApplicationPageSizeChange() {
    this.applicationCurrentPage = 1;
  }
}
