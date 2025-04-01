import {Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})

export class UserProfileComponent {
  profileForm!: FormGroup;
  userId: number = 1; 
  loading = true;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserProfile();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      pin: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      sex: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      faculty: ['', Validators.required]
    });
  }

  loadUserProfile(): void {
    this.profileService.getProfile(this.userId).subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
        this.loading = false;
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
      updatedProfile.id = this.userId;

      this.profileService.updateProfile(updatedProfile).subscribe({
        next: () => {
          alert('Profil actualizat cu succes');
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
