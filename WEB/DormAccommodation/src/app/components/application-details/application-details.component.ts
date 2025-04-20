import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApplicationService} from '../../../services/application.service';
import {UserApplicationDto} from '../../models/user.application.dto';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-application-details',
  standalone: false,
  templateUrl: './application-details.component.html',
  styleUrl: './application-details.component.css'
})
export class ApplicationDetailsComponent implements OnInit {
  applicationId: number | null = null;
  application: UserApplicationDto | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  public userRole: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private profileService: ProfileService
  ) { 
    this.userRole = parseInt(this.profileService.getUserProp("role") ?? "0");
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.applicationId = +idParam;
        this.loadApplicationDetails();
      } else {
        this.errorMessage = 'No application ID provided';
        this.loading = false;
      }
    });
  }

  hasPreferences(): boolean {
    if (this.application?.preferences) {
      return Object.keys(this.application.preferences).length > 0;
    }
    return false;
  }

  loadApplicationDetails(): void {
    if (this.applicationId) {
      this.applicationService.getApplicationDetails(this.applicationId).subscribe({
        next: (application) => {
          this.application = application;
          this.loading = false;
          console.log(this.application);
        },
        error: (error) => {
          this.errorMessage = 'Error loading application details.';
          console.error(error);
          this.loading = false;
        }
      });
    }
  }
}
