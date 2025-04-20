import {Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { Profile } from '../../models/profile.model';
import { FacultyService } from '../../../services/faculty.service';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})

export class UserProfileComponent {
  profileForm!: FormGroup;
  userId!: string  ;
  loading = true;
  errorMessage: string = '';
  pin!: boolean;
  faculties: { id: number, name: string }[] = [];
  token: string |null;

  constructor(private fb: FormBuilder, private profileService: ProfileService, private facultyService: FacultyService) {
    this.token = sessionStorage.getItem("Key")

  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadFaculties();
    this.loadUserProfile();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      pin: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      sex: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      faculty: ['', Validators.required],
      yearOfStudy: ['', [Validators.required, Validators.min(1), Validators.max(6)]]
    });
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data) => {
        this.faculties = data;  // Populate the faculties array
      },
      error: (error) => {
        this.errorMessage = 'Error loading faculties data.';
        console.error(error);
      }
    });
  }

  loadUserProfile(): void {
    this.userId = this.profileService.getUserProp("nameid") ?? "";
    this.profileService.getProfile(this.userId).subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
        this.loading = false;
        if(profile.pin){
          this.pin = true;
        }
        else{
          this.pin = false
        }
      },
      error: (error) => {
        this.errorMessage = 'Error loading profile data.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const updatedProfile: Profile = this.profileForm.value;
       updatedProfile.id = Number(this.userId);

      this.profileService.updateProfile(this.userId, updatedProfile).subscribe({
        next: () => {

          alert('Profil actualizat cu succes');
          window.location.reload();
        },
        error: (error) => {
          this.errorMessage = 'Nu s-a putut actualiza profilul. Încearcă din nou.';
          console.error(error);
        }
      });
    } else {
      this.errorMessage = 'Vă rugăm să completați corect toate câmpurile obligatorii';
    }
  }


}
