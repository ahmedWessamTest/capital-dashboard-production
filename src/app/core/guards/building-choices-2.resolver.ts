import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { BuildingInsurancesListResponse, BuildingInsurancesService } from '../../pages/dashboard/dashboard-pages/property-insurance/services/property-insurance.service';
import { BuildingRequestResponse, BuildingRequestsService } from '../../pages/dashboard/dashboard-pages/property-requests/services/property-requests.service';

export interface BuildingCategoriesInsuranceData {
  buildingInsurances: BuildingInsurancesListResponse;
  buildingRequest?: BuildingRequestResponse;
}

export const buildingChoices2Resolver: ResolveFn<BuildingCategoriesInsuranceData | BuildingInsurancesListResponse> = (route, state) => {
  const buildingInsurancesService = inject(BuildingInsurancesService);
  const buildingRequestsService = inject(BuildingRequestsService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  const id = route.paramMap.get('id');

  ngxSpinnerService.show("actionsLoader");

  if (!id) {
    return buildingInsurancesService.getAll();
  }

  return forkJoin({
    buildingInsurances: buildingInsurancesService.getAll(),
    buildingRequest: buildingRequestsService.getById(+id)
  });
};