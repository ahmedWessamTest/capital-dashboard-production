

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CategoriesService, CategoryResponse } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
import { MedicalInsurancesService, MedicalInsuranceResponse } from '../../pages/dashboard/dashboard-pages/medical-insurances/services/medical-insurances.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MedicalClaimResponse, MedicalClaimsListResponse, MedicalClaimsService } from '../services/claims/medical-claim.service';

export interface MedicalClaimCombinedResponse {
  medicalClaim: MedicalClaimResponse;
  category: CategoryResponse;
  medicalInsurance: MedicalInsuranceResponse | null; // Allow null
}

@Injectable({
  providedIn: 'root'
})
export class medicalClaimResolver implements Resolve<MedicalClaimsListResponse | MedicalClaimCombinedResponse> {
  constructor(
    private medicalClaimsService: MedicalClaimsService,
    private categoriesService: CategoriesService,
    private medicalInsurancesService: MedicalInsurancesService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MedicalClaimsListResponse | MedicalClaimCombinedResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');

    if (!id) {
      return this.medicalClaimsService.getAll();
    }

    return this.medicalClaimsService.getById(+id).pipe(
      switchMap((medicalClaim: MedicalClaimResponse) => {
        const categoryId = medicalClaim.data.category_id;
        const medicalInsuranceId = Number(medicalClaim.data.medical_insurance_id);

        // Check if medicalInsuranceId is 0 or NaN (from null/undefined)
        const medicalInsuranceObservable = (medicalInsuranceId && medicalInsuranceId !== 0)
          ? this.medicalInsurancesService.getById(medicalInsuranceId)
          : of(null);

        return forkJoin([
          of(medicalClaim),
          this.categoriesService.getById(categoryId),
          medicalInsuranceObservable
        ]).pipe(
          map(([medicalClaim, category, medicalInsurance]) => ({
            medicalClaim,
            category,
            medicalInsurance
          }))
        );
      })
    );
  }
}