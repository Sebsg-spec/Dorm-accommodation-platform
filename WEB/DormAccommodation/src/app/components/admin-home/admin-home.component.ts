import {Component, OnInit} from '@angular/core';
import {Consts} from '../../utils/Consts';
import {Router} from '@angular/router';
import {ProfileService} from '../../../services/profile.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccommodationSessionDto} from '../../models/accommodation.session.dto';
import {AccommodationSessionService} from '../../../services/accommodation.session.service';

@Component({
  selector: 'app-admin-home',
  standalone: false,
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit {

  activeTab: 'your-applications' | 'history' = 'your-applications';
  protected readonly Consts = Consts;
  userRole: number | null = null;
  accommodationSessionId: number = 0;
  accommodationSession: AccommodationSessionDto = new AccommodationSessionDto(0, "", 1, "", "", "", "", "", "")

  accommodationSessionForm!: FormGroup;
  loading = true;
  errorMessage: string = '';
  currentDate = new Date();
  minApplicationPhaseStartDate = "";
  constructor(private router: Router,
              private profileService: ProfileService,
              private accommodationSessionService: AccommodationSessionService,
              private fb: FormBuilder) {
    this.userRole = parseInt(this.profileService.getUserProp("role") ?? "0");
    this.minApplicationPhaseStartDate = this.currentDate.getFullYear().toString() + "-" + ((this.currentDate.getMonth() + 1).toString().length === 1? "0" + (this.currentDate.getMonth() + 1).toString() : (this.currentDate.getMonth() + 1).toString()) + "-" + this.currentDate.getDate().toString()
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCurrentAccommodationSession();
    this.setupDateListeners();

  }

  setupDateListeners(): void {
    const pairs = [
      ['applicationPhaseStartDate', 'applicationPhaseEndDate'],
      ['assignmentPhaseStartDate', 'assignmentPhaseEndDate'],
      ['reassignmentPhaseStartDate', 'reassignmentPhaseEndDate'],
    ];

    const phaseConflicts = [
      ['applicationPhaseEndDate', 'assignmentPhaseStartDate'],
      ['assignmentPhaseEndDate', 'reassignmentPhaseStartDate'],
    ]

    pairs.forEach(([startKey, endKey]) => {
      const startControl = this.accommodationSessionForm.get(startKey);
      const endControl = this.accommodationSessionForm.get(endKey);

      if (startControl && endControl) {
        startControl.valueChanges.subscribe(() => this.validateDates(startControl, endControl));
        endControl.valueChanges.subscribe(() => this.validateDates(startControl, endControl));
      }
    });

    phaseConflicts.forEach(([startKey, endKey]) => {
      const startControl = this.accommodationSessionForm.get(startKey);
      const endControl = this.accommodationSessionForm.get(endKey);

      if (startControl && endControl) {
        startControl.valueChanges.subscribe(() => this.checkPhaseConflicts(startControl, endControl));
        endControl.valueChanges.subscribe(() => this.checkPhaseConflicts(startControl, endControl));
      }
    });
  }

  checkPhaseConflicts(startControl: AbstractControl, endControl: AbstractControl): void {
    const start = new Date(startControl.value);
    const end = new Date(endControl.value);

    const invalid = start > end;

    if (invalid) {
      console.log("phase conflict")
      startControl.setErrors({ ...startControl.errors, phaseConflict: true });
      endControl.setErrors({ ...endControl.errors, phaseConflict: true });
    } else {
      console.log("no phase conflict")
      if (startControl.errors?.['phaseConflict']) {
        const { phaseConflict, ...otherErrors } = startControl.errors;
        startControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }

      if (endControl.errors?.['phaseConflict']) {
        const { phaseConflict, ...otherErrors } = endControl.errors;
        endControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }
    }
  }
  validateDates(startControl: AbstractControl, endControl: AbstractControl): void {
    const start = new Date(startControl.value);
    const end = new Date(endControl.value);

    const invalid = start > end;

    if (invalid) {
      startControl.setErrors({ ...startControl.errors, dateRangeInvalid: true });
      endControl.setErrors({ ...endControl.errors, dateRangeInvalid: true });
    } else {
      if (startControl.errors?.['dateRangeInvalid']) {
        const { dateRangeInvalid, ...otherErrors } = startControl.errors;
        startControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }

      if (endControl.errors?.['dateRangeInvalid']) {
        const { dateRangeInvalid, ...otherErrors } = endControl.errors;
        endControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }
    }
    console.log(this.accommodationSessionForm.getError('dateRangeInvalid'))
  }
  initializeForm(): void {
    this.accommodationSessionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      applicationPhaseStartDate: ['', Validators.required],
      applicationPhaseEndDate: ['', Validators.required],
      assignmentPhaseStartDate: ['', Validators.required],
      assignmentPhaseEndDate: ['', Validators.required],
      reassignmentPhaseStartDate: ['', Validators.required],
      reassignmentPhaseEndDate: ['', Validators.required]
    });
  }

  switchTabs() {
    if (this.activeTab === 'your-applications') {
      this.activeTab = 'history';
    } else {
      this.activeTab = 'your-applications';
    }
  }

  loadCurrentAccommodationSession() {
    this.accommodationSessionService.getCurrent().subscribe({
      next: (accommodationSession) => {
        this.accommodationSessionId = accommodationSession.id;
        this.accommodationSession = accommodationSession;
        this.accommodationSessionForm.patchValue(accommodationSession);
        this.loading = false;
        console.log(accommodationSession)
      },
      error: (error) => {
        this.errorMessage = 'Error loading profile data.';
        console.error(error);
        this.loading = false;
      }
    })
  }

  updateAccommodationSession() {
    if (this.accommodationSessionForm.valid) {
      this.accommodationSession = this.accommodationSessionForm.value;
      this.accommodationSession.id = this.accommodationSessionId;
      this.accommodationSession.active = 1;
      console.log(JSON.stringify(this.accommodationSession));


      this.accommodationSessionService.update(this.accommodationSession).subscribe({
        next: () => {

          alert('Sesiune actualizata cu succes');
          window.location.reload();
        },
        error: (error) => {
          this.errorMessage = 'Nu s-a putut actualiza sesiunea. Încearcă din nou.';
          console.error(error);
        }
      });
    } else {
      console.log(this.accommodationSessionForm.errors)
      this.errorMessage = 'Vă rugăm să completați corect toate câmpurile obligatorii';
      console.log(this.errorMessage)
    }
  }

  createSession() {
    if (this.accommodationSessionForm.valid) {
      this.accommodationSession = this.accommodationSessionForm.value;
      this.accommodationSession.id = this.accommodationSessionId;
      this.accommodationSession.active = 1;
      console.log(JSON.stringify(this.accommodationSession));


      this.accommodationSessionService.create(this.accommodationSession).subscribe({
        next: () => {

          alert('Sesiune actualizata cu succes');
          window.location.reload();
        },
        error: (error) => {
          this.errorMessage = 'Nu s-a putut actualiza sesiunea. Încearcă din nou.';
          console.error(error);
        }
      });
    } else {
      console.log(this.accommodationSessionForm.errors)
      this.errorMessage = 'Vă rugăm să completați corect toate câmpurile obligatorii';
      console.log(this.errorMessage)
    }
  }

  protected readonly Date = Date;
}
