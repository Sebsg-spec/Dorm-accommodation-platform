import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DormService } from '../../../services/dorm.service';
import { Dorm } from '../../models/dorm.model';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../../services/profile.service';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../models/application.model';
import { DormPreferenceService } from './../../../services/dormPreference';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dorm-registration-page',
  standalone: false,
  templateUrl: './dorm-registration-page.component.html',
  styleUrls: ['./dorm-registration-page.component.css'],
})
export class DormRegistrationPageComponent {
  dormApplicationForm!: FormGroup;
  selectedFiles: File[] = [];
  selectedAdditionalFiles: File[] = [];
  dorms: Dorm[] = [];

  userId: string = '';
  token: string = sessionStorage.getItem('Key') ?? '';
  userProfile!: Profile;
  loadingProfile = true;
  errorMessage = '';

  filteredDorms1: Dorm[] = [];
  filteredDorms2: Dorm[] = [];
  filteredDorms3: Dorm[] = []; 
  constructor(
    private fb: FormBuilder,
    private dormService: DormService,
    private profileService: ProfileService,
    private applicationService: ApplicationService,
    private dormPreferenceService: DormPreferenceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDorms();
    this.loadUserProfile(); 

    this.dormApplicationForm.get('dormPreference1')?.valueChanges.subscribe(() => this.updateDormFilters());
    this.dormApplicationForm.get('dormPreference2')?.valueChanges.subscribe(() => this.updateDormFilters());
    this.dormApplicationForm.get('dormPreference3')?.valueChanges.subscribe(() => this.updateDormFilters());
  }

  initializeForm(): void {
    this.dormApplicationForm = this.fb.group({
      document: [null, Validators.required],
      universityGrade: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      dormPreference1: ['', Validators.required],
      dormPreference2: ['', Validators.required],
      dormPreference3: ['', Validators.required],
      applyForRedistribution: [false],
      specialRequest: [false],
      specialRequestType: [''],
      additionalDocuments: [null],
    });

    this.dormApplicationForm.get('dormPreference1')?.valueChanges.subscribe(() => this.updateDormFilters());
    this.dormApplicationForm.get('dormPreference2')?.valueChanges.subscribe(() => this.updateDormFilters());
    this.dormApplicationForm.get('dormPreference3')?.valueChanges.subscribe(() => this.updateDormFilters());
  
  }

  loadDorms(): void {
    this.dormService.getDorms().subscribe({
      next: (data: Dorm[]) => {
        this.dorms = data;
    this.updateDormFilters()

      },
      error: (err) => {
        console.error('Error loading dorms', err);
      },
    });
  }
  updateDormFilters(): void {
    const selected1 = this.dormApplicationForm.get('dormPreference1')?.value;
    const selected2 = this.dormApplicationForm.get('dormPreference2')?.value;
    const selected3 = this.dormApplicationForm.get('dormPreference3')?.value;
  
    this.filteredDorms1 = this.dorms.filter(dorm => String(dorm.id)!== String(selected2) && String(dorm.id) !== String(selected3));
    this.filteredDorms2 = this.dorms.filter(dorm => String(dorm.id) !== String(selected1) && String(dorm.id) !== String(selected3));
    this.filteredDorms3 = this.dorms.filter(dorm => String(dorm.id) !== String(selected1) && String(dorm.id) !== String(selected2));
  
  }
  loadUserProfile(): void {
    this.userId = this.profileService.getUserProp('nameid') ?? '';
    if (this.userId) {
      this.profileService.getProfile(this.userId).subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.loadingProfile = false;
        },
        error: (error) => {
          this.errorMessage = 'Error loading profile data.';
          console.error(error);
          this.loadingProfile = false;
        },
      });
    } else {
      this.errorMessage = 'Invalid or missing token.';
      this.loadingProfile = false;
    }
  }

  onFileChange(event: any, type: string) {
    const files: File[] = Array.from(event.target.files);
    if (files.length == 0)
      return;

    if (type === 'document') {
      this.selectedFiles = files;
      this.dormApplicationForm.patchValue({ document: files });
    } else if (type === 'additionalDocuments') {
      this.selectedAdditionalFiles = files;
      this.dormApplicationForm.patchValue({ additionalDocuments: files });
    }
  }

  onSpecialRequestChange(event: any) {
    const isChecked = event.target.checked;
    if (!isChecked) {
      this.dormApplicationForm.get('specialRequestType')?.reset();
      this.dormApplicationForm.get('additionalDocuments')?.reset();
    }
  }

  onSubmit() {
    if (this.dormApplicationForm.valid && this.userProfile) {
      const formData = new FormData();
      this.selectedFiles.forEach((file, _) => {
        formData.append('files', file, file.name);
      });

      this.selectedAdditionalFiles.forEach((file, _) => {
        formData.append('files', file, file.name);
      });

      const metadata: Application = {
        user: this.userProfile.id,
        applicationName: "",
        faculty: this.userProfile.faculty,
        grade: this.dormApplicationForm.get('universityGrade')?.value,
        uuid: uuidv4(),
        year: 1,
        lastUpdate: new Date(),
        // check for the correct status
        status: 1,
      };

      formData.append('meta', JSON.stringify(metadata));

      this.applicationService.postApplication(formData).subscribe({
        next: (createdApp) => {
          const dormPreference1 =
            this.dormApplicationForm.get('dormPreference1')?.value;
          const dormPreference2 =
            this.dormApplicationForm.get('dormPreference2')?.value;
          const dormPreference3 =
            this.dormApplicationForm.get('dormPreference3')?.value;

          if (createdApp.id) {
            const dormPreferences = [
              {
                application: createdApp.id,
                dorm: dormPreference1,
                preference: 1,
              },
              {
                application: createdApp.id,
                dorm: dormPreference2,
                preference: 2,
              },
              {
                application: createdApp.id,
                dorm: dormPreference3,
                preference: 3,
              },
            ];

            // Post dorm preferences
            this.dormPreferenceService
              .postDormPreferences(dormPreferences)
              .subscribe({
                next: () => {
                  console.log('Dorm preferences successfully created');
                },
                error: (err) => {
                  console.error('❌ Error posting dorm preferences:', err);
                },
              });
          }
          this.router.navigate(['/home']);
        },

        error: (err) => {
          console.error('❌ Error posting application:', err);
        },
      });
    } else {
      console.log('Form is invalid or profile not loaded');
    }
  }

  isValidGrade(event: KeyboardEvent): boolean {
    const charCode = event.charCode;
    // Allow only numbers (0-9) and dots
    if (charCode >= 48 && charCode <= 57 || charCode === 46) {
      return true;
    }

    event.preventDefault();
    return false;
  }
}
