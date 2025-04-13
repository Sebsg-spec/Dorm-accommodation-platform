import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DormService } from '../../../services/dorm.service';
import { Dorm } from '../../models/dorm.model';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../../services/profile.service';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../models/application.model';
import { faculty } from '../../models/faculty.model';
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
  selectedFile: File | null = null;
  selectedAdditionalFile: File | null = null;
  dorms: Dorm[] = [];

  userId: string = '';
  token: string = sessionStorage.getItem('Key') ?? '';
  userProfile!: Profile;
  loadingProfile = true;
  errorMessage = '';

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
    this.loadUserProfile(); // 👈 Load user profile
  }

  initializeForm(): void {
    this.dormApplicationForm = this.fb.group({
      document: [null, Validators.required],
      dormPreference1: ['', Validators.required],
      dormPreference2: ['', Validators.required],
      dormPreference3: ['', Validators.required],
      applyForRedistribution: [false],
      specialRequest: [false],
      specialRequestType: [''],
      additionalDocuments: [null],
    });
  }

  loadDorms(): void {
    this.dormService.getDorms().subscribe({
      next: (data: Dorm[]) => {
        this.dorms = data;
      },
      error: (err) => {
        console.error('Error loading dorms', err);
      },
    });
  }

  loadUserProfile(): void {
    this.userId = this.profileService.getUserIdFromToken(this.token) ?? '';
    console.log('this.userId:', this.userId);
    if (this.userId) {
      this.profileService.getProfile(this.userId).subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.loadingProfile = false;
          console.log('Loaded user profile:', profile);
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
    const file = event.target.files[0];
    if (file) {
      if (type === 'document') {
        this.selectedFile = file;
        this.dormApplicationForm.patchValue({ document: file });
      } else if (type === 'additionalDocuments') {
        this.selectedAdditionalFile = file;
        this.dormApplicationForm.patchValue({ additionalDocuments: file });
      }
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
      console.log('Form Values:', this.dormApplicationForm.value);
      console.log('Selected File:', this.selectedFile);

      const formData = new FormData();
      formData.append('document', this.selectedFile as Blob);
      formData.append(
        'dormPreference1',
        this.dormApplicationForm.get('dormPreference1')?.value
      );
      formData.append(
        'dormPreference2',
        this.dormApplicationForm.get('dormPreference2')?.value
      );
      formData.append(
        'dormPreference3',
        this.dormApplicationForm.get('dormPreference3')?.value
      );
      formData.append(
        'applyForRedistribution',
        this.dormApplicationForm.get('applyForRedistribution')?.value
          ? 'true'
          : 'false'
      );

      // formData.append('userId', this.userProfile.id); // or whatever unique ID field you have
      // formData.append('firstName', this.userProfile.firstName);
      // formData.append('lastName', this.userProfile.lastName);
      // formData.append('faculty', this.userProfile.faculty);
      // formData.append('studyYear', this.userProfile.yearOfStudy);

      if (this.dormApplicationForm.get('specialRequest')?.value) {
        formData.append(
          'specialRequestType',
          this.dormApplicationForm.get('specialRequestType')?.value
        );
        if (this.selectedAdditionalFile) {
          formData.append(
            'additionalDocuments',
            this.selectedAdditionalFile as Blob
          );
        }
      }
      const app: Application = {
        user: this.userProfile.id,
        faculty: this.userProfile.faculty,
        uuid: uuidv4(),
        year: 1,
        lastUpdate: new Date(),
        // check for the correct status
        status: 1,
      };

      this.applicationService.postApplication(app).subscribe({
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
}
