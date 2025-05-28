import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Consts} from '../../utils/Consts';
import {ApplicationService} from '../../../services/application.service';
import {UserApplicationDto} from '../../models/user.application.dto';
import {ProfileService} from '../../../services/profile.service';
import {AccommodationSessionDto} from '../../models/accommodation.session.dto';
import {AccommodationSessionService} from '../../../services/accommodation.session.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public currentAccommodationSession: AccommodationSessionDto = new AccommodationSessionDto(0, "", 0, "", "", "", "", "", "");

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
              private profileService: ProfileService,
              private accommodationSessionService: AccommodationSessionService) {
    this.userRole = parseInt(this.profileService.getUserProp("role") ?? "0");

  }

  getCurrentSession() {

    this.accommodationSessionService.getCurrent().subscribe(
      (response) => {

        this.currentAccommodationSession = response;
        let currentDate = new Date();

        // the current session has passed / not started yet
        //@ts-ignore
        if (currentDate < new Date(this.currentAccommodationSession.applicationPhaseStartDate) || currentDate > new Date(this.currentAccommodationSession.reassignmentPhaseEndDate)) {
          this.showWhat = Consts.SESSION_CLOSED;
        }

        // the current session ahs started and is in the application phase
        //@ts-ignore
        if (currentDate > new Date(this.currentAccommodationSession.applicationPhaseStartDate) && currentDate < new Date(this.currentAccommodationSession.applicationPhaseEndDate)) {
          this.showWhat = Consts.SESSION_OPEN_APPLICATIONS_PHASE;
        }

        // the current session has started and is in the assignment phase
        //@ts-ignore
        if (currentDate > new Date(this.currentAccommodationSession.assignmentPhaseStartDate) && currentDate < new Date(this.currentAccommodationSession.assignmentPhaseEndDate)) {
          this.showWhat = Consts.SESSION_OPEN_ASSIGNMENT_PHASE;
        }

        // the current session has started and is in the reassignment phase
        //@ts-ignore
        if (currentDate > new Date(this.currentAccommodationSession.reassignmentPhaseStartDate) && currentDate < new Date(this.currentAccommodationSession.reassignmentPhaseEndDate)) {
          this.showWhat = Consts.SESSION_OPEN_REASSIGNMENT_PHASE;
        }

      }, error => {
        console.error(error);
        // server sends null when there are no active sessions => no active sessions
        this.showWhat = Consts.SESSION_CLOSED;
      }
    )
  }

  ngOnInit(): void {
    this.getCurrentSession();
    this.getApplications();
  }


  getApplications() {

    this.applicationService.getUserApplications().subscribe(
      (res) => {
        console.log(res)


        if (res.length > 0) {
          if (this.showWhat === Consts.SESSION_CLOSED) {

            // if session is closed add all applications to history
            this.history = res;

          } else {
            // only applications from current session will be added to open applications
            //@ts-ignore
            this.openApplications = res.filter(app => new Date(app.lastUpdate) > new Date(this.currentAccommodationSession.applicationPhaseStartDate) && new Date(app.lastUpdate) < new Date(this.currentAccommodationSession.reassignmentPhaseEndDate))


            if (this.userRole === 2) {

              // if the student has no applications for current session
              if (this.openApplications.length === 0) {
                this.history = res;
              } else {
                this.history = res.filter(app => new Date(app.lastUpdate) < new Date(this.currentAccommodationSession.applicationPhaseStartDate) || new Date(app.lastUpdate) > new Date(this.currentAccommodationSession.reassignmentPhaseEndDate))
              }

            } else {
              this.history = res.filter(app => new Date(app.lastUpdate) < new Date(this.currentAccommodationSession.applicationPhaseStartDate) || new Date(app.lastUpdate) > new Date(this.currentAccommodationSession.reassignmentPhaseEndDate))
            }
          }
        }
      }, error => {
        console.log(error);
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
    this.router.navigate(['dosar']);
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
