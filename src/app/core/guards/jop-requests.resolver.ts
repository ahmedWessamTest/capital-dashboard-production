// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { Observable, forkJoin } from 'rxjs';
// import { GetAllJop } from '../../jop-insurance/res/interface/getAllJop';
// import { JopInsurancesService } from '../../jop-insurance/res/services/jop-insurance.service';
// import {
//   CategoriesListResponse,
//   CategoriesService,
// } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
// import {
//   JobRequestResponse,
//   JobRequestsListResponse,
//   JobRequestsService,
// } from '../../pages/dashboard/dashboard-pages/jop-requests/services/jop-requests.service';

// export interface JobRequestCombinedData {
//   jobInsurances: GetAllJop;
//   categories: CategoriesListResponse;
//   jobRequest?: JobRequestResponse;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class JobRequestsResolver
//   implements Resolve<JobRequestCombinedData | JobRequestsListResponse>
// {
//   constructor(
//     private jobRequestsService: JobRequestsService,
//     private categoriesService: CategoriesService,
//     private jobInsurancesService: JopInsurancesService,
//     private ngxSpinnerService: NgxSpinnerService
//   ) {}

//   resolve(
//     route: ActivatedRouteSnapshot
//   ): Observable<JobRequestCombinedData | JobRequestsListResponse> {
//     this.ngxSpinnerService.show('actionsLoader');
//     const id = route.paramMap.get('id');

//     if (!id) {
//       return forkJoin({
//         jobInsurances: this.jobInsurancesService.getAll(),
//         categories: this.categoriesService.getAll(),
//       });
//     }

//     return forkJoin({
//       jobInsurances: this.jobInsurancesService.getAll(),
//       categories: this.categoriesService.getAll(),
//       jobRequest: this.jobRequestsService.getById(+id),
//     });
//   }
// }
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
  JobRequestResponse,
  JobRequestsListResponse,
  JobRequestsService,
} from '../../pages/dashboard/dashboard-pages/jop-requests/services/jop-requests.service';

export interface JobRequestCombinedResponse {
  jobRequest: JobRequestResponse;
  category: CategoryResponse;
  jopInsurance: IJopInsurance | null;
}

@Injectable({
  providedIn: 'root',
})
export class JobRequestsResolver
  implements Resolve<JobRequestsListResponse | JobRequestCombinedResponse>
{
  constructor(
    private jobRequestsService: JobRequestsService,
    private categoriesService: CategoriesService,
    private jopInsurancesService: JopInsurancesService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<JobRequestsListResponse | JobRequestCombinedResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');

    if (!id) {
      return this.jobRequestsService.getAll();
    }

    return this.jobRequestsService.getById(+id).pipe(
      switchMap((jobRequest: JobRequestResponse) => {
        const categoryId = jobRequest.data.category_id;
        const jopInsuranceId = Number(jobRequest.data.jop_insurance_id);

        // Check if jopInsuranceId is 0 or NaN (from null/undefined)
        const jopInsuranceObservable =
          jopInsuranceId && jopInsuranceId !== 0
            ? this.jopInsurancesService.getById(jopInsuranceId)
            : of(null); // Return null observable if jopInsuranceId is invalid

        return forkJoin([
          of(jobRequest),
          this.categoriesService.getById(categoryId),
          jopInsuranceObservable,
        ]).pipe(
          map(([jobRequest, category, jopInsurance]) => ({
            jobRequest,
            category,
            jopInsurance,
          }))
        );
      })
    );
  }
}
