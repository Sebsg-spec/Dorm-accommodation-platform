import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApplicationService} from '../../../services/application.service';
import {UserApplicationDto} from '../../models/user.application.dto';
import { ProfileService } from '../../../services/profile.service';
import { StatusUpdateDto } from '../../models/status.update.dto';

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
  
  statuses: { id: number, name: string }[] = [
    // { id: 1, name: 'În curs de verificare' },
    { id: 2, name: 'În așteptare' },
    { id: 3, name: 'Validat' },
    // { id: 4, name: 'Repartizat' },
    // { id: 5, name: 'Cămin acceptat' },
    { id: 6, name: 'Respins' },
    // { id: 7, name: 'Cămin refuzat' }
  ];
  selectedStatusId: number = this.statuses[0].id;
  statusComment: string = '';
  updateStatusLoading: boolean = false;

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
        this.errorMessage = 'Nu a fost furnizat un ID al dosarului.';
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
          if (this.application?.status?.id) {
            const statusExists = this.statuses.some(s => s.id === this.application?.status?.id);
            if (statusExists) {
              this.selectedStatusId = this.application.status.id;
            }
          }
          console.log(this.application);
        },
        error: (error) => {
          this.errorMessage = 'A apărut o eroare la încărcarea detaliilor despre dosar.';
          console.error(error);
          this.loading = false;
        }
      });
    }
  }

  updateApplicationStatus(): void {
    if (!this.statusComment || this.statusComment.trim().length < 5) {
      this.errorMessage = 'Comentariul trebuie să conțină minim 5 caractere.';
      return;
    }

    if (!this.applicationId || this.userRole !== 3) {
      this.errorMessage = 'Nu aveți permisiunea să actualizați statusul dosarului.';
      return;
    }

    this.updateStatusLoading = true;
    this.applicationService.updateApplicationStatus(
      this.applicationId, 
      new StatusUpdateDto(this.selectedStatusId, this.statusComment)
    ).subscribe({
      next: () => {
        this.statusComment = '';
        this.loadApplicationDetails();
        this.updateStatusLoading = false;
      },
      error: (error) => {
        this.updateStatusLoading = false;
        this.errorMessage = 'A apărut o eroare la actualizarea statusului.';
        console.error(error);
      }
    });
  }
}
