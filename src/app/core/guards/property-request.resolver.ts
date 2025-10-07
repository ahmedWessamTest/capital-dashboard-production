import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CategoriesService, CategoryResponse } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BuildingInsuranceResponse, BuildingInsurancesService } from '../../pages/dashboard/dashboard-pages/property-insurance/services/property-insurance.service';
import { BuildingRequestResponse, BuildingRequestsListResponse, BuildingRequestsService } from '../../pages/dashboard/dashboard-pages/property-requests/services/property-requests.service';

export interface BuildingRequestCombinedResponse {
  buildingRequest: BuildingRequestResponse;
  category: CategoryResponse;
  buildingInsurance: BuildingInsuranceResponse;
}

@Injectable({
  providedIn: 'root'
})
export class propertyRequestResolver implements Resolve<BuildingRequestsListResponse | BuildingRequestCombinedResponse> {
  constructor(
    private buildingRequestsService: BuildingRequestsService,
    private categoriesService: CategoriesService,
    private buildingInsurancesService: BuildingInsurancesService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<BuildingRequestsListResponse | BuildingRequestCombinedResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    
    if (!id) {
      return this.buildingRequestsService.getAll();
    }

    return this.buildingRequestsService.getById(+id).pipe(
      switchMap((buildingRequest: BuildingRequestResponse) => {
        const categoryId = buildingRequest.data.category_id;
        const buildingInsuranceId = buildingRequest.data.building_insurance_id;

        return forkJoin([
          of(buildingRequest),
          this.categoriesService.getById(categoryId),
          this.buildingInsurancesService.getById(buildingInsuranceId)
        ]).pipe(
          map(([buildingRequest, category, buildingInsurance]) => ({
            buildingRequest,
            category,
            buildingInsurance
          }))
        );
      })
    );
  }
}