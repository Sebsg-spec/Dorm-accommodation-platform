import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';
import { ProfileService } from '../../../services/profile.service';
import { UserApplicationDto } from '../../models/user.application.dto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-application-update',
  standalone: false,
  templateUrl: './application-update.component.html',
  styleUrl: './application-update.component.css'
})
export class ApplicationUpdateComponent implements OnInit {
  applicationId: number | null = null;
  application: UserApplicationDto | null = null;
  userRole: number | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  
  files: string[] = [];
  selectedFile: string | null = null;
  fileObject: SafeResourceUrl | null = null;
  fileLoading: boolean = false;
  
  newDocumentFiles: File[] = [];
  documentsToDelete: string[] = [];
  confirmationMode: boolean = false;

  @ViewChild('fileInput') fileInput: ElementRef | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
        this.loadPdfFiles();
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
    if (!this.applicationId) return;
    
    this.applicationService.getApplicationDetails(this.applicationId).subscribe({
      next: (response) => {
        this.application = response;
        
        // Redirect user if not allowed to update
        if (this.userRole === 3 || this.application.status.id !== 2) {
          this.router.navigate(['/home']);
          return;
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Eroare la încărcarea detaliilor dosarului.';
        this.loading = false;
        console.error('Error loading application details:', error);
      }
    });
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

  onFileChange(event: any): void {
    const files: File[] = Array.from(event.target.files || []);
    
    // If no files are selected, clear the newDocumentFiles array
    if (files.length === 0) {
      this.newDocumentFiles = [];
      return;
    }
    
    // Only allow PDF files
    const validFiles = files.filter(file => file.type === 'application/pdf');
    if (validFiles.length !== files.length) {
      this.errorMessage = 'Doar fișierele PDF sunt acceptate.';
      return;
    }
    
    this.newDocumentFiles = [...this.newDocumentFiles, ...validFiles];
  }

  removeNewFile(index: number): void {
    this.newDocumentFiles = this.newDocumentFiles.filter((_, i) => i !== index);
  }

  toggleDeleteFile(fileName: string): void {
    if (this.documentsToDelete.includes(fileName)) {
      this.documentsToDelete = this.documentsToDelete.filter(f => f !== fileName);
    } else {
      this.documentsToDelete.push(fileName);
    }
  }

  isMarkedForDeletion(fileName: string): boolean {
    return this.documentsToDelete.includes(fileName);
  }

  toggleConfirmationMode(): void {
    if (this.newDocumentFiles.length === 0 && this.documentsToDelete.length === 0) {
      this.errorMessage = 'Nu ai făcut nicio modificare.';
      return;
    }
    
    this.confirmationMode = !this.confirmationMode;
    this.errorMessage = '';

    console.log(this.newDocumentFiles, this.documentsToDelete);
  }

  applyChanges(): void {
    if (!this.applicationId) return;

    if (this.newDocumentFiles.length === 0 && this.documentsToDelete.length === 0) {
      this.errorMessage = 'Nu ai făcut nicio modificare.';
      return;
    }
    
    const formData = new FormData();
    this.newDocumentFiles.forEach((file, _) => {
      formData.append('files', file, file.name);
    });

    const metadata: string[] = [];
    this.documentsToDelete.forEach((file, _) => {
      metadata.push(file);
    });

    formData.append('meta', JSON.stringify(metadata));

    this.applicationService.updateDocumentsBatch(
      this.applicationId,
      formData
    ).subscribe({
      next: () => {
        // navigate to application details
        this.router.navigate(['/application-details', this.applicationId]);
      },
      error: (error) => {
        this.errorMessage = 'A apărut o eroare la actualizarea documentelor.';
        this.confirmationMode = false;
        console.error('Error updating documents:', error);
      }
    });
  }

  cancelChanges(): void {
    this.confirmationMode = false;
  }
}
