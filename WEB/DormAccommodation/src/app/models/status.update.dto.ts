export class StatusUpdateDto {
  status: number;
  comment: string;

  constructor(status: number, comment: string) {
    this.status = status;
    this.comment = comment;
  }
}
