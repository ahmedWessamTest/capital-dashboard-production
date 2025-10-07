import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IJopInsurance } from '../../jop-insurance/res/interface/getAllJop';
import { JopInsurancesService } from '../../jop-insurance/res/services/jop-insurance.service';
import {
  CategoriesService,
  CategoryResponse,
} from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
import {
  JobClaimResponse,
  JobClaimsListResponse,
  JobClaimsService,
} from '../services/claims/jop-claim.service';

export interface JobClaimCombinedResponse {
  jobClaim: JobClaimResponse;
  category: CategoryResponse;
  jopInsurance: IJopInsurance | null;
}

@Injectable({
  providedIn: 'root',
})
export class JobClaimResolver
  implements Resolve<JobClaimsListResponse | JobClaimCombinedResponse>
{
  constructor(
    private jobClaimsService: JobClaimsService,
    private categoriesService: CategoriesService,
    private jopInsurancesService: JopInsurancesService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<JobClaimsListResponse | JobClaimCombinedResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');

    if (!id) {
      return this.jobClaimsService.getAll();
    }

    return this.jobClaimsService.getById(+id).pipe(
      switchMap((jobClaim: JobClaimResponse) => {
        const categoryId = jobClaim.data.category_id;
        const jopInsuranceId = Number(jobClaim.data.jop_insurance_id);

        // Check if jopInsuranceId is 0 or NaN (from null/undefined)
        const jopInsuranceObservable =
          jopInsuranceId && jopInsuranceId !== 0
            ? this.jopInsurancesService.getById(jopInsuranceId)
            : of(null); // Return null observable if jopInsuranceId is invalid

        return forkJoin([
          of(jobClaim),
          this.categoriesService.getById(categoryId),
          jopInsuranceObservable,
        ]).pipe(
          map(([jobClaim, category, jopInsurance]) => ({
            jobClaim,
            category,
            jopInsurance,
          }))
        );
      })
    );
  }
}
