import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { MedicalInsurancesListResponse, MedicalInsurancesService } from '../../pages/dashboard/dashboard-pages/medical-insurances/services/medical-insurances.service';
import { MedicalRequestsService, MedicalRequestResponse } from '../../pages/dashboard/dashboard-pages/medical-requests/services/medical-requests.service';
import { NgxSpinnerService } from 'ngx-spinner';

export interface MedicalCategoriesInsuranceData {
  medicalInsurances: MedicalInsurancesListResponse;
  medicalRequest?: MedicalRequestResponse;
}

export const medicalCatgoriesInsuranceResolver: ResolveFn<MedicalCategoriesInsuranceData | MedicalInsurancesListResponse> = (route, state) => {
  const medicalInsurancesService = inject(MedicalInsurancesService);
  const medicalRequestsService = inject(MedicalRequestsService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  const id = route.paramMap.get('id');

  ngxSpinnerService.show("actionsLoader");

  if (!id) {
    return medicalInsurancesService.getAll();
  }

  return forkJoin({
    medicalInsurances: medicalInsurancesService.getAll(),
    medicalRequest: medicalRequestsService.getById(+id)
  });
};