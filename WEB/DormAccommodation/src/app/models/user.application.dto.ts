import {Status} from './status.model';

export class UserApplicationDto {
  applicationId: number;
  applicationName: string;
  studentName: string;
  faculty: string;
  year: number;
  lastUpdate: Date;
  status: Status;
  comment: string;
  assignedDorm: number;
  preferences: Map<number,string>

  constructor(applicationId: number,applicationName: string, studentName: string, faculty: string, year: number,
              lastUpdate: Date, status: Status, comment: string, assignedDorm: number,
              preferences: Map<number,string>) {
    this.applicationId = applicationId;
    this.applicationName = applicationName;
    this.studentName = studentName;
    this.faculty = faculty;
    this.year = year;
    this.lastUpdate = lastUpdate;
    this.status = status;
    this.comment = comment;
    this.assignedDorm = assignedDorm;
    this.preferences = preferences;
  }
}
