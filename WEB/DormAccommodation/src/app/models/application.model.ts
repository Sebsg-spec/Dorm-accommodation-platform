export class Application {
  user: number;
  faculty: number;
  uuid: string;
  year: number;
  last_update: Date;
  status: number;
  comment: string;
  assigned_dorm: number;

  constructor(user: number, faculty: number, uuid: string, year: number,
              last_update: Date, status: number, comment: string, assigned_dorm: number) {
    this.user = user;
    this.faculty = faculty;
    this.uuid = uuid;
    this.year = year;
    this.last_update = last_update;
    this.status = status;
    this.comment = comment;
    this.assigned_dorm = assigned_dorm;
  }
}
