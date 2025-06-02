import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApplicationService} from '../../../services/application.service';
import {UserApplicationDto} from '../../models/user.application.dto';
import { ProfileService } from '../../../services/profile.service';
import { StatusUpdateDto } from '../../models/status.update.dto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-application-details',
  standalone: false,
  templateUrl: './application-details.component.html',
  styleUrl: './application-details.component.css'
})
export class ApplicationDetailsComponent implements OnInit {
  applicationId: number | null = null;
  application: UserApplicationDto | null = null;

  public userRole: number | null = null;
  errorMessage: string = '';

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
  loading: boolean = true;

  updateStatusLoading: boolean = false;
  updateSuccess: boolean = false;

  actionLoading: boolean = false;
  actionSuccess: boolean = false;

  files: string[] = [];
  selectedFile: string | null = null;

  fileObject: SafeResourceUrl | null = null;
  fileLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private profileService: ProfileService,
    private sanitizer: DomSanitizer
  ) {
    this.userRole = parseInt(this.profileService.getUserProp("role") ?? "0");
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.applicationId = +idParam;
        this.loadApplicationDetails();
        if (this.userRole === 3) {
          this.loadPdfFiles();
        }
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
    if (!this.statusComment || this.statusComment.trim().length < 5 || this.statusComment.trim().length > 255) {
      this.errorMessage = 'Comentariul trebuie să conțină minim 5 caractere si maxim 255 de caractere.';
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
        this.showSuccessFeedback();
      },
      error: (error) => {
        this.updateStatusLoading = false;
        this.errorMessage = 'A apărut o eroare la actualizarea statusului.';
        console.error(error);
      }
    });
  }

  showSuccessFeedback(): void {
    this.updateSuccess = true;
    setTimeout(() => {
      this.updateSuccess = false;
    }, 3000);
  }

  loadPdfFiles(): void {
    if (!this.applicationId) return;

    this.applicationService.getApplicationDocuments(this.applicationId).subscribe({
      next: (files) => {
        this.files = files;
      },
      error: (error) => {
        console.error('Error loading PDF files:', error);
      }
    });
  }

  viewPdf(file: string): void {
    if (!this.applicationId) return;

    this.fileLoading = true;
    this.fileObject = null;

    this.applicationService.getDocumentFile(this.applicationId, file).subscribe({
      next: (response) => {
        const fileURL = URL.createObjectURL(response);
        this.fileObject = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.selectedFile = file;
        this.fileLoading = false;
      },
      error: (error) => {
        console.error('Error loading PDF file:', error);
        this.fileLoading = false;
        this.errorMessage = 'Eroare la încărcarea documentului.';
      }
    });
  }

  acceptApplication(): void {
    if (!this.applicationId || this.userRole !== 2) {
      this.errorMessage = 'Nu aveți permisiunea să acceptați repartizarea.';
      return;
    }

    if (this.application?.status?.id !== 4) {
      this.errorMessage = 'Acțiunea nu este disponibilă în statusul curent.';
      return;
    }

    this.actionLoading = true;
    this.applicationService.acceptApplication(
      this.applicationId,
    ).subscribe({
      next: () => {
        this.loadApplicationDetails();
        this.actionLoading = false;
        this.showActionSuccessFeedback();
      },
      error: (error) => {
        this.actionLoading = false;
        this.errorMessage = 'A apărut o eroare la procesarea acțiunii.';
        console.error(error);
      }
    });
  }

  declineApplication(): void {
    if (!this.applicationId || this.userRole !== 2) {
      this.errorMessage = 'Nu aveți permisiunea să refuzați repartizarea.';
      return;
    }

    if (this.application?.status?.id !== 4) {
      this.errorMessage = 'Acțiunea nu este disponibilă în statusul curent.';
      return;
    }

    this.actionLoading = true;
    this.applicationService.declineApplication(
      this.applicationId,
    ).subscribe({
      next: () => {
        this.loadApplicationDetails();
        this.actionLoading = false;
        this.showActionSuccessFeedback();
      },
      error: (error) => {
        this.actionLoading = false;
        this.errorMessage = 'A apărut o eroare la procesarea acțiunii.';
        console.error(error);
      }
    });
  }

  applyForRedistribution(): void {
    if (!this.applicationId || this.userRole !== 2) {
      this.errorMessage = 'Nu aveți permisiunea să aplicați pentru redistribuire.';
      return;
    }

    if (this.application?.status?.id !== 4) {
      this.errorMessage = 'Acțiunea nu este disponibilă în statusul curent.';
      return;
    }

    this.actionLoading = true;
    this.applicationService.applyForRedistribution(
      this.applicationId
    ).subscribe({
      next: () => {
        this.loadApplicationDetails();
        this.actionLoading = false;
        this.showActionSuccessFeedback();
      },
      error: (error : any) => {
        this.actionLoading = false;
        this.errorMessage = 'A apărut o eroare la trimiterea cererii de redistribuire.';
        console.error(error);
      }
    });
  }
  showActionSuccessFeedback(): void {
    this.actionSuccess = true;
    setTimeout(() => {
      this.actionSuccess = false;
    }, 3000);
  }
}
