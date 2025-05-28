export class AccommodationSessionDto {

  id: number;
  name: string;
  active: number;
  applicationPhaseStartDate: string;
  applicationPhaseEndDate: string;
  assignmentPhaseStartDate: string;
  assignmentPhaseEndDate: string;
  reassignmentPhaseStartDate: string;
  reassignmentPhaseEndDate: string;


  constructor(id: number, name: string,active: number,
              applicationPeriodStart: string, applicationPeriodEnd: string,
              assignmentPeriodStart: string, assignmentPeriodEnd: string,
              reassignmentPeriodStart: string, reassignmentPeriodEnd: string) {

    this.id = id;
    this.name = name;
    this.active = 1;
    this.applicationPhaseStartDate = applicationPeriodStart;
    this.applicationPhaseEndDate = applicationPeriodEnd;
    this.assignmentPhaseStartDate = assignmentPeriodStart;
    this.assignmentPhaseEndDate = assignmentPeriodEnd;
    this.reassignmentPhaseStartDate = reassignmentPeriodStart;
    this.reassignmentPhaseEndDate = reassignmentPeriodEnd;
  }


}
