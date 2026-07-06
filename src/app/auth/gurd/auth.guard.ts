import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = () => {
  const _router = inject(Router);

  if (localStorage.getItem("user")) {
    _router.navigate(["/dashboard"]);
    return false;
  } else {
    return true;
  }
};
