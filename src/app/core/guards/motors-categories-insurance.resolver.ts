import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MotorInsurancesListResponse, MotorInsurancesService } from '../../pages/dashboard/dashboard-pages/motor-insurance/services/motor-insurance.service';
import { MotorRequestResponse, MotorRequestsService } from '../../pages/dashboard/dashboard-pages/motors-requests/services/motors-requests.service';
import { CarTypesService, CarTypesListResponse } from '../../pages/dashboard/dashboard-pages/car-types/services/car-types.service';
import { CarBrandsService, CarBrandsListResponse } from '../../pages/dashboard/dashboard-pages/car-brands/services/car-brands.service';
import { CarYearsService, CarYearsListResponse } from '../../pages/dashboard/dashboard-pages/car-years/services/car-years.service';
import { CarModelsListResponse, CarModelsService } from '../../pages/dashboard/dashboard-pages/car-model/services/car-model.service';

export interface MotorCategoriesInsuranceData {
  motorInsurances: MotorInsurancesListResponse;
  motorRequest?: MotorRequestResponse;
  carTypes: CarTypesListResponse;
  carBrands: CarBrandsListResponse;
  carModels: CarModelsListResponse;
  carYears: CarYearsListResponse;
}

export const motorCategoriesInsuranceResolver: ResolveFn<MotorCategoriesInsuranceData | MotorInsurancesListResponse> = (route, state) => {
  const motorInsurancesService = inject(MotorInsurancesService);
  const motorRequestsService = inject(MotorRequestsService);
  const carTypesService = inject(CarTypesService);
  const carBrandsService = inject(CarBrandsService);
  const carModelsService = inject(CarModelsService);
  const carYearsService = inject(CarYearsService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  const id = route.paramMap.get('id');

  ngxSpinnerService.show('actionsLoader');

  if (!id) {
    return forkJoin({
      motorInsurances: motorInsurancesService.getAll(),
      carTypes: carTypesService.getAll(),
      carBrands: carBrandsService.getAll(),
      carModels: carModelsService.getAll(),
      carYears: carYearsService.getAll()
    });
  }

  return forkJoin({
    motorInsurances: motorInsurancesService.getAll(),
    motorRequest: motorRequestsService.getById(+id),
    carTypes: carTypesService.getAll(),
    carBrands: carBrandsService.getAll(),
    carModels: carModelsService.getAll(),
    carYears: carYearsService.getAll()
  });
};