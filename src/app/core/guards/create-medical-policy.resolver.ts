import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MedicalDataResponse, MedicalInsuranceService } from '../services/policies/medical-policy.service';
import { UsersResponse, UserService } from '../services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';

export interface MedicalPolicyResolverData {
  users: UsersResponse;
  medicalData: MedicalDataResponse;
}

export const medicalPolicyResolver: ResolveFn<MedicalPolicyResolverData> = (): Observable<MedicalPolicyResolverData> => {
  const medicalInsuranceService = inject(MedicalInsuranceService);
  const userService = inject(UserService);
  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show('actionsLoader');

  return forkJoin({
    users: userService.getAll(),
    medicalData: medicalInsuranceService.fetchMedicalData()
  });
};