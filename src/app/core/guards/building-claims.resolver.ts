// import { Injectable } from '@angular/core';
// import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
// import { Observable, forkJoin, of } from 'rxjs';
// import { map, switchMap } from 'rxjs/operators';
// import { CategoriesService, CategoryResponse } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { BuildingClaimResponse, BuildingClaimsListResponse, BuildingClaimsService } from '../services/claims/building-claim.service';
// import { BuildingInsuranceResponse, BuildingInsurancesService } from '../../pages/dashboard/dashboard-pages/property-insurance/services/property-insurance.service';

// export interface BuildingClaimCombinedResponse {
//   buildingClaim: BuildingClaimResponse;
//   category: CategoryResponse;
//   buildingInsurance: BuildingInsuranceResponse;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class BuildingClaimResolver implements Resolve<BuildingClaimsListResponse | BuildingClaimCombinedResponse> {
//   constructor(
//     private buildingClaimsService: BuildingClaimsService,
//     private categoriesService: CategoriesService,
//     private buildingInsurancesService: BuildingInsurancesService,
//     private ngxSpinnerService: NgxSpinnerService
//   ) {}

//   resolve(route: ActivatedRouteSnapshot): Observable<BuildingClaimsListResponse | BuildingClaimCombinedResponse> {
//     this.ngxSpinnerService.show('actionsLoader');
//     const id = route.paramMap.get('id');

//     if (!id) {
//       return this.buildingClaimsService.getAll();
//     }

//     return this.buildingClaimsService.getById(+id).pipe(
//       switchMap((buildingClaim: BuildingClaimResponse) => {
//         const categoryId = buildingClaim.data.category_id;
//         const buildingInsuranceId = Number(buildingClaim.data.building_insurance_id);

//         return forkJoin([
//           of(buildingClaim),
//           this.categoriesService.getById(categoryId),
//           this.buildingInsurancesService.getById(buildingInsuranceId)
//         ]).pipe(
//           map(([buildingClaim, category, buildingInsurance]) => ({
//             buildingClaim,
//             category,
//             buildingInsurance
//           }))
//         );
//       })
//     );
//   }
// }


import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CategoriesService, CategoryResponse } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BuildingClaimResponse, BuildingClaimsListResponse, BuildingClaimsService } from '../services/claims/building-claim.service';
import { BuildingInsuranceResponse, BuildingInsurancesService } from '../../pages/dashboard/dashboard-pages/property-insurance/services/property-insurance.service';

export interface BuildingClaimCombinedResponse {
  buildingClaim: BuildingClaimResponse;
  category: CategoryResponse;
  buildingInsurance: BuildingInsuranceResponse | null; // Allow null
}

@Injectable({
  providedIn: 'root'
})
export class BuildingClaimResolver implements Resolve<BuildingClaimsListResponse | BuildingClaimCombinedResponse> {
  constructor(
    private buildingClaimsService: BuildingClaimsService,
    private categoriesService: CategoriesService,
    private buildingInsurancesService: BuildingInsurancesService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<BuildingClaimsListResponse | BuildingClaimCombinedResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');

    if (!id) {
      return this.buildingClaimsService.getAll();
    }

    return this.buildingClaimsService.getById(+id).pipe(
      switchMap((buildingClaim: BuildingClaimResponse) => {
        const categoryId = buildingClaim.data.category_id;
        const buildingInsuranceId = Number(buildingClaim.data.building_insurance_id);

        // Check if buildingInsuranceId is 0 or NaN (from null/undefined)
        const buildingInsuranceObservable = (buildingInsuranceId && buildingInsuranceId !== 0)
          ? this.buildingInsurancesService.getById(buildingInsuranceId)
          : of(null);

        return forkJoin([
          of(buildingClaim),
          this.categoriesService.getById(categoryId),
          buildingInsuranceObservable
        ]).pipe(
          map(([buildingClaim, category, buildingInsurance]) => ({
            buildingClaim,
            category,
            buildingInsurance
          }))
        );
      })
    );
  }
}