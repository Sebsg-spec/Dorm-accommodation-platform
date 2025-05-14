export class Application {
  id?: number;
  applicationName: string;
  user: number;
  faculty: number;
  grade: number;
  uuid: string;
  year: number;
  lastUpdate: Date;
  status: number;
  comment?: string;
  assigned_dorm?: number;

  constructor(id:number,user: number, faculty: number, grade: number, uuid: string, year: number,
              last_update: Date, status: number, comment: string, assigned_dorm: number) {
    this.id = id;
    this.applicationName = "";
    this.user = user;
    this.faculty = faculty;
    this.grade = grade;
    this.uuid = uuid;
    this.year = year;
    this.lastUpdate = last_update;
    this.status = status;
    this.comment = comment;
    this.assigned_dorm = assigned_dorm;
  }
}
