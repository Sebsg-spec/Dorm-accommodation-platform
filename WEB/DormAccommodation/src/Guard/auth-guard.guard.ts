import { CanActivateFn } from '@angular/router';



export const authGuardGuard: CanActivateFn = (route, state) => {
  var access = sessionStorage.getItem('canAcces');


  if (access == "true") {

    return true;
  } else {
    window.location.href = '/'
    return false;
  }

};