import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const loginGuard: CanActivateFn = () => {
  const _Router = inject(Router);
  const userToken = localStorage.getItem("user");

  if (userToken) {
    return true;
  } else {
    _Router.navigate(["/login"]);
    return false;
  }
};
