import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { BuildTypesService, BuildTypesListResponse } from '../../pages/dashboard/dashboard-pages/build-types/services/build-types.service';
import { BuildCountriesService, BuildCountriesListResponse } from '../../pages/dashboard/dashboard-pages/build-countries/services/build-countries.service';
import { BuildingInsurancesListResponse, BuildingInsurancesService } from '../../pages/dashboard/dashboard-pages/property-insurance/services/property-insurance.service';
import { BuildingRequestResponse, BuildingRequestsService } from '../../pages/dashboard/dashboard-pages/property-requests/services/property-requests.service';

export interface BuildingCategoriesInsuranceData {
  buildingInsurances: BuildingInsurancesListResponse;
  buildingRequest?: BuildingRequestResponse;
  buildTypes: BuildTypesListResponse;
  buildCountries: BuildCountriesListResponse;
}

export const propertCategoriesInsuranceResolver: ResolveFn<BuildingCategoriesInsuranceData | BuildingInsurancesListResponse> = (route, state) => {
  const buildingInsurancesService = inject(BuildingInsurancesService);
  const buildingRequestsService = inject(BuildingRequestsService);
  const buildTypesService = inject(BuildTypesService);
  const buildCountriesService = inject(BuildCountriesService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  const id = route.paramMap.get('id');

  ngxSpinnerService.show('actionsLoader');

  if (!id) {
    return forkJoin({
      buildingInsurances: buildingInsurancesService.getAll(),
      buildTypes: buildTypesService.getAll(),
      buildCountries: buildCountriesService.getAll()
    });
  }

  return forkJoin({
    buildingInsurances: buildingInsurancesService.getAll(),
    buildingRequest: buildingRequestsService.getById(+id),
    buildTypes: buildTypesService.getAll(),
    buildCountries: buildCountriesService.getAll()
  });
};