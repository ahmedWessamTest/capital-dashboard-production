import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CategoriesService, CategoryResponse } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
import { MotorClaimsService, MotorClaimResponse, MotorClaimsListResponse } from '../services/claims/motor-claim.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MotorInsuranceResponse, MotorInsurancesService } from '../../pages/dashboard/dashboard-pages/motor-insurance/services/motor-insurance.service';

export interface MotorClaimCombinedResponse {
  motorClaim: MotorClaimResponse;
  category: CategoryResponse;
  motorInsurance: MotorInsuranceResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class MotorClaimResolver implements Resolve <
  MotorClaimsListResponse | MotorClaimCombinedResponse
  > {
  constructor(
    private motorClaimsService: MotorClaimsService,
    private categoriesService: CategoriesService,
    private motorInsurancesService: MotorInsurancesService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}
resolve(
  route: ActivatedRouteSnapshot
): Observable<MotorClaimsListResponse | MotorClaimCombinedResponse> {
  this.ngxSpinnerService.show('actionsLoader');
  const id = route.paramMap.get('id');

  if (!id) {
    return this.motorClaimsService.getAll();
  }

  return this.motorClaimsService.getById(+id).pipe(
    switchMap((motorClaim: MotorClaimResponse) => {
      const categoryId = motorClaim.data.category_id;
      const motorInsuranceId = Number(motorClaim.data.motor_insurance_id);

      // Check if motorInsuranceId is 0 or NaN (from null/undefined)
      const motorInsuranceObservable = (motorInsuranceId && motorInsuranceId !== 0)
        ? this.motorInsurancesService.getById(motorInsuranceId)
        : of(null); // Return null observable if motorInsuranceId is invalid

      return forkJoin([
        of(motorClaim),
        this.categoriesService.getById(categoryId),
        motorInsuranceObservable,
      ]).pipe(
        map(([motorClaim, category, motorInsurance]) => ({
          motorClaim,
          category,
          motorInsurance,
        }))
      );
    })
);
}
}