import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserApplicationDto} from '../../models/user.application.dto';
import {Status} from '../../models/status.model';
import {DatePipe} from '@angular/common';
import {ProfileService} from '../../../services/profile.service';

@Component({
  selector: 'app-application-card',
  standalone: false,
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.css',
  providers: [DatePipe]
})
export class ApplicationCardComponent implements OnInit {

  @Input() currentApplication: UserApplicationDto = new UserApplicationDto(0, "???", "Student cu nume lung", "Facultatea de cuvinte lungi",
    0, new Date(), new Status(0, ""), "??", 0, "???", new Map());
  @Output() viewDetailsEvent = new EventEmitter<number>();
  @Output() updateApplicationEvent = new EventEmitter<number>();
  
  public userRole: number | null = null;

  constructor(private profileService: ProfileService) {
    this.userRole = parseInt(this.profileService.getUserProp("role") ?? "0");
  }

  ngOnInit(): void {

  }

  GoToApplicationDetails() {
    this.viewDetailsEvent.emit(this.currentApplication.applicationId);
  }
  
  GoToUpdateApplication() {
    this.updateApplicationEvent.emit(this.currentApplication.applicationId);
  }
}
