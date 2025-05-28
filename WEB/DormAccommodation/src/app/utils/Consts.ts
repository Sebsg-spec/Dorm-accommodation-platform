export enum Consts {

  SESSION_CLOSED,
  APPLICATIONS_LOADING,
  SESSION_OPEN_APPLICATIONS_PHASE,
  SESSION_OPEN_ASSIGNMENT_PHASE,
  SESSION_OPEN_REASSIGNMENT_PHASE,

  BASE_URL = `https://localhost:7038/api`,

  APPLICATIONS_GET = `${BASE_URL}/Applications/GetApplications`,
  APPLICATIONS = `${BASE_URL}/Applications`,

  APPLICATION_DETAILS = `${BASE_URL}/Applications/Details`,
  APPLICATION_DOCUMENTS = `${BASE_URL}/Applications/Documents`,

  FACULTIES_GET_ALL = `${BASE_URL}/Faculties`,

  LOGIN = `${BASE_URL}/Users/login`,
  REGISTER = `${BASE_URL}/Users/register`,

  USERS = `${BASE_URL}/Users`,
  USER_UPDATE_ROLE = `${BASE_URL}/Users/UpdateRole`,

  USER_PROFILE = `${BASE_URL}/Profiles`,

  DORMS = `${BASE_URL}/Dorms`,

  DORM_PREFERENCES = `${BASE_URL}/DormPreferences`,

  ACCOMMODATION_SESSIONS_GET_CURRENT = `${BASE_URL}/AccommodationSessions/GetCurrent`,
  ACCOMMODATION_SESSIONS_CREATE = `${BASE_URL}/AccommodationSessions`,
  ACCOMMODATION_SESSIONS_UPDATE = `${BASE_URL}/AccommodationSessions`

}

