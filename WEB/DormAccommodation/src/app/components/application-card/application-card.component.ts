import {Component, Input, OnInit} from '@angular/core';
import {UserApplicationDto} from '../../models/user.application.dto';
import {Status} from '../../models/status.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-application-card',
  standalone: false,
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.css',
  providers: [DatePipe]
})
export class ApplicationCardComponent implements OnInit {

  @Input() currentApplication: UserApplicationDto = new UserApplicationDto(0, "???", "Student cu nume lung", "Facultatea de cuvinte lungi",
    0, new Date(), new Status(0, ""), "??", 0, new Map());

  constructor() {

  }

  ngOnInit(): void {

  }

  GoToApplicationDetails() {
    alert("Going to application details page.");
  }

}
