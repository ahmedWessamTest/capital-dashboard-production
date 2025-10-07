import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { BuildingDataResponse, BuildingInsuranceService } from '../services/policies/building-policy.service';
import { UsersResponse, UserService } from '../services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';

export interface BuildingPolicyResolverData {
  users: UsersResponse;
  buildingData: BuildingDataResponse;
}

export const buildingPolicyResolver: ResolveFn<BuildingPolicyResolverData> = (): Observable<BuildingPolicyResolverData> => {
  const buildingInsuranceService = inject(BuildingInsuranceService);
  const userService = inject(UserService);
  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show('actionsLoader');

  return forkJoin({
    users: userService.getAll(),
    buildingData: buildingInsuranceService.fetchBuildingData()
  });
};