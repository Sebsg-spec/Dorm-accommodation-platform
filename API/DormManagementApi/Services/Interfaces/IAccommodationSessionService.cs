using System.Transactions;
using DormManagementApi.Models;

namespace DormManagementApi.Services.Interfaces
{
    public interface IAccommodationSessionService
    {

        public AccommodationSessionDto Get(int accommodationSessionId);
        public bool Exists(int accommodationSessionId);
        public IEnumerable<AccommodationSessionDetails> GetAccommodationSessionDetailsEntries(int accommodationSessionId);
        public AccommodationSessionDto GetActiveSession();
        public IEnumerable<AccommodationSessionDto> GetHistory();

        public bool Create(AccommodationSessionDto accommodationSession);
        public bool Update(AccommodationSessionDto accommodationSession);

        public bool Delete(int accommodationSessionId);

    }


    public class AccommodationSessionService : IAccommodationSessionService
    {
        private readonly DormContext context;

        public AccommodationSessionService(DormContext context)
        {

            this.context = context;
        }

        public bool Create(AccommodationSessionDto accommodationSessionDto)
        {

            // find the currently active session and deactivate it, as we cannot have more than one active session at a time
            AccommodationSession activeSession = context.AccommodationSession.FirstOrDefault(x => x.Active == 1);
            if (activeSession != null)
            {
                activeSession.Active = 0;
                context.Entry(activeSession).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                context.SaveChanges();
            }


            AccommodationSession session = new AccommodationSession();
            session.Name = accommodationSessionDto.Name;
            session.Active = 1;
            context.AccommodationSession.Add(session);
            int saved = context.SaveChanges();

            if (saved != 0)
            {


                AccommodationSessionDetails applicationPhase = new AccommodationSessionDetails(session.Id, accommodationSessionDto.ApplicationPhaseStartDate.ToDateTime(new TimeOnly(8,0,0)), accommodationSessionDto.ApplicationPhaseEndDate.ToDateTime(new TimeOnly(22, 0, 0)), 1);
                AccommodationSessionDetails assignmentPhase = new AccommodationSessionDetails(session.Id, accommodationSessionDto.AssignmentPhaseStartDate.ToDateTime(new TimeOnly(8, 0, 0)), accommodationSessionDto.AssignmentPhaseEndDate.ToDateTime(new TimeOnly(22, 0, 0)), 2);
                AccommodationSessionDetails reassignmentPhase = new AccommodationSessionDetails(session.Id, accommodationSessionDto.ReassignmentPhaseStartDate.ToDateTime(new TimeOnly(8, 0, 0)), accommodationSessionDto.ReassignmentPhaseEndDate.ToDateTime(new TimeOnly(22, 0, 0)), 3);

                context.AccommodationSessionDetails.Add(applicationPhase);
                context.AccommodationSessionDetails.Add(assignmentPhase);
                context.AccommodationSessionDetails.Add(reassignmentPhase);

                saved = context.SaveChanges();

                if (saved == 0)
                {
                    Delete(session.Id);
                    return false;
                }
                return true;
            }
            return false;
        }

        public bool Delete(int accommodationSessionId)
        {
            AccommodationSession accommodationSession = context.AccommodationSession.Find(accommodationSessionId);

            if (accommodationSession != null)
            {
                List<AccommodationSessionDetails> accommodationSessionDetails = GetAccommodationSessionDetailsEntries(accommodationSessionId).ToList();
                context.AccommodationSessionDetails.RemoveRange(accommodationSessionDetails);
                int deleted = context.SaveChanges();
                if (deleted == 3)
                {
                    context.AccommodationSession.Remove(accommodationSession);
                    deleted = context.SaveChanges();
                    if (deleted == 1)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                return false;
            }
            return false;
        }

        public AccommodationSessionDto Get(int accommodationSessionId)
        {
            AccommodationSession accommodationSession = context.AccommodationSession.Find(accommodationSessionId);

            if (accommodationSession != null)
            {
                AccommodationSessionDetails applicationPhase = context.AccommodationSessionDetails.First(x => x.AccommodationSessionId == accommodationSessionId && x.SessionPhase == 1);
                AccommodationSessionDetails assignmentPhase = context.AccommodationSessionDetails.First(x => x.AccommodationSessionId == accommodationSessionId && x.SessionPhase == 2);
                AccommodationSessionDetails reassignmentPhase = context.AccommodationSessionDetails.First(x => x.AccommodationSessionId == accommodationSessionId && x.SessionPhase == 3);

                AccommodationSessionDto dto = toDto(accommodationSession, applicationPhase, assignmentPhase, reassignmentPhase);
                return dto;
            }
            return null;
        }

        public AccommodationSessionDto? GetActiveSession()
        {
            AccommodationSession activeAccommodationSession = context.AccommodationSession.FirstOrDefault(x => x.Active == 1);

            if (activeAccommodationSession == null)
                return null;

            int accommodationSessionId = activeAccommodationSession.Id;

            AccommodationSessionDetails applicationPhase = context.AccommodationSessionDetails.FirstOrDefault(x => x.AccommodationSessionId == accommodationSessionId && x.SessionPhase == 1);
            AccommodationSessionDetails assignmentPhase = context.AccommodationSessionDetails.FirstOrDefault(x => x.AccommodationSessionId == accommodationSessionId && x.SessionPhase == 2);
            AccommodationSessionDetails reassignmentPhase = context.AccommodationSessionDetails.FirstOrDefault(x => x.AccommodationSessionId == accommodationSessionId && x.SessionPhase == 3);


            if(DateTime.Now > reassignmentPhase.EndDate)
            {
                return null;
            }

            AccommodationSessionDto dto = toDto(activeAccommodationSession, applicationPhase, assignmentPhase, reassignmentPhase);
            return dto;
        }

        public IEnumerable<AccommodationSessionDto> GetHistory()
        {
            return new List<AccommodationSessionDto>();
        }

        public bool Update(AccommodationSessionDto accommodationSessionDto)
        {
            // get the application, assignment, confirmation and reassignment entries from the details table and update them
            AccommodationSession accommodationSession = ToAccommodationSession(accommodationSessionDto);
            AccommodationSessionDetails applicationPhaseDetails = ToAccommodationSessionDetails(accommodationSessionDto, 1);
            AccommodationSessionDetails assignmentPhaseDetails = ToAccommodationSessionDetails(accommodationSessionDto, 2);
            AccommodationSessionDetails reassignmentPhaseDetails = ToAccommodationSessionDetails(accommodationSessionDto, 3);

            context.Entry(accommodationSession).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            context.Entry(applicationPhaseDetails).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            context.Entry(assignmentPhaseDetails).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            context.Entry(reassignmentPhaseDetails).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            int updated = context.SaveChanges();

            return updated > 0;
        }


        public AccommodationSessionDto toDto(AccommodationSession applicationSession, AccommodationSessionDetails applicationPhase, AccommodationSessionDetails assignmentPhase, AccommodationSessionDetails reassignmentPhase)
        {
            AccommodationSessionDto result = new AccommodationSessionDto();
            result.Active = applicationSession.Active;
            result.Id = applicationSession.Id;
            result.Name = applicationSession.Name;
            result.ApplicationPhaseStartDate = new DateOnly(applicationPhase.StartDate.Year, applicationPhase.StartDate.Month, applicationPhase.StartDate.Day);
            result.ApplicationPhaseEndDate = new DateOnly(applicationPhase.EndDate.Year, applicationPhase.EndDate.Month, applicationPhase.EndDate.Day);
            result.AssignmentPhaseStartDate = new DateOnly(assignmentPhase.StartDate.Year, assignmentPhase.StartDate.Month, assignmentPhase.StartDate.Day);
            result.AssignmentPhaseEndDate = new DateOnly(assignmentPhase.EndDate.Year, assignmentPhase.EndDate.Month, assignmentPhase.EndDate.Day);
            result.ReassignmentPhaseStartDate = new DateOnly(reassignmentPhase.StartDate.Year, reassignmentPhase.StartDate.Month, reassignmentPhase.StartDate.Day);
            result.ReassignmentPhaseEndDate = new DateOnly(reassignmentPhase.EndDate.Year, reassignmentPhase.EndDate.Month, reassignmentPhase.EndDate.Day);

            return result;
        }

        public AccommodationSession ToAccommodationSession(AccommodationSessionDto accommodationSessionDto)
        {
            AccommodationSession accommodationSession = new AccommodationSession();
            accommodationSession.Id = accommodationSessionDto.Id;
            accommodationSession.Name = accommodationSessionDto.Name;
            accommodationSession.Active = accommodationSessionDto.Active;
            return accommodationSession;
        }

        public AccommodationSessionDetails ToAccommodationSessionDetails(AccommodationSessionDto accommodationSessionDto, int sessionPhase)
        {
            AccommodationSessionDetails accommodationSessionDetails = context.AccommodationSessionDetails.First(x => x.AccommodationSessionId == accommodationSessionDto.Id && x.SessionPhase == sessionPhase);

            switch (sessionPhase)
            {
                case 1:
                    accommodationSessionDetails.StartDate = accommodationSessionDto.ApplicationPhaseStartDate.ToDateTime(new TimeOnly(8,0,0));
                    accommodationSessionDetails.EndDate = accommodationSessionDto.ApplicationPhaseEndDate.ToDateTime(new TimeOnly(22, 0, 0));
                    break;
                case 2:
                    accommodationSessionDetails.StartDate = accommodationSessionDto.AssignmentPhaseStartDate.ToDateTime(new TimeOnly(8, 0, 0));
                    accommodationSessionDetails.EndDate = accommodationSessionDto.AssignmentPhaseEndDate.ToDateTime(new TimeOnly(22, 0, 0));
                    break;
                case 3:
                    accommodationSessionDetails.StartDate = accommodationSessionDto.ReassignmentPhaseStartDate.ToDateTime(new TimeOnly(8, 0, 0));
                    accommodationSessionDetails.EndDate = accommodationSessionDto.ReassignmentPhaseEndDate.ToDateTime(new TimeOnly(22, 0, 0));
                    break;
            }

            return accommodationSessionDetails;
        }

        public IEnumerable<AccommodationSessionDetails> GetAccommodationSessionDetailsEntries(int accommodationSessionId)
        {
            return context.AccommodationSessionDetails.Where(x => x.AccommodationSessionId == accommodationSessionId);
        }

        public bool Exists(int accommodationSessionId)
        {
            return context.AccommodationSession.Any(obj => obj.Id == accommodationSessionId);
        }
    }
}
