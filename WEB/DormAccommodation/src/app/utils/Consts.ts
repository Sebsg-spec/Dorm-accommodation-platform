export enum Consts {

  APPLICATIONS_CLOSED,
  APPLICATIONS_OPEN_NONE_REGISTERED,
  APPLICATIONS_OPEN_REGISTERED_ALREADY,

  BASE_URL = `https://localhost:7038/api`,

  APPLICATIONS_GET = `${BASE_URL}/Applications/GetApplications`,

  FACULTIES_GET_ALL = `${BASE_URL}/Faculties`,

  LOGIN = `${BASE_URL}/Users/login`,
  REGISTER = `${BASE_URL}/Users/register`,

  USER_PROFILE = `${BASE_URL}/Profiles`
}

