import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { UsersResponse, UserService } from '../services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MotorDataResponse, MotorInsuranceService } from '../services/policies/motors-policy.service';

export interface MotorPolicyResolverData {
  users: UsersResponse;
  motorData: MotorDataResponse;
}

export const motorPolicyResolver: ResolveFn<MotorPolicyResolverData> = (): Observable<MotorPolicyResolverData> => {
  const motorInsuranceService = inject(MotorInsuranceService);
  const userService = inject(UserService);
  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show('actionsLoader');

  return forkJoin({
    users: userService.getAll(),
    motorData: motorInsuranceService.fetchMotorData()
  });
};