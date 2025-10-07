import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import {
  JopDataResponse,
  JopInsuranceService,
} from '../services/policies/jop-policy.service';
import { UserService, UsersResponse } from '../services/users/users.service';

export interface JopPolicyResolverData {
  users: UsersResponse;
  jopData: JopDataResponse;
}

export const jopPolicyResolver: ResolveFn<
  JopPolicyResolverData
> = (): Observable<JopPolicyResolverData> => {
  const jopInsuranceService = inject(JopInsuranceService);
  const userService = inject(UserService);
  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show('actionsLoader');

  return forkJoin({
    users: userService.getAll(),
    jopData: jopInsuranceService.fetchJopData(),
  });
};
