import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CategoriesService, CategoryResponse } from '../../pages/dashboard/dashboard-pages/categories/services/categories.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MotorInsuranceResponse, MotorInsurancesService } from '../../pages/dashboard/dashboard-pages/motor-insurance/services/motor-insurance.service';
import { MotorRequestResponse, MotorRequestsListResponse, MotorRequestsService } from '../../pages/dashboard/dashboard-pages/motors-requests/services/motors-requests.service';

export interface MotorRequestCombinedResponse {
  motorRequest: MotorRequestResponse;
  category: CategoryResponse;
  motorInsurance: MotorInsuranceResponse;
}

@Injectable({
  providedIn: 'root'
})
export class MotorRequestsResolver implements Resolve<MotorRequestsListResponse | MotorRequestCombinedResponse> {
  constructor(
    private motorRequestsService: MotorRequestsService,
    private categoriesService: CategoriesService,
    private motorInsurancesService: MotorInsurancesService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MotorRequestsListResponse | MotorRequestCombinedResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    
    if (!id) {
      return this.motorRequestsService.getAll();
    }

    return this.motorRequestsService.getById(+id).pipe(
      switchMap((motorRequest: MotorRequestResponse) => {
        const categoryId = motorRequest.data.category_id;
        const motorInsuranceId = motorRequest.data.motor_insurance_id;

        return forkJoin([
          of(motorRequest),
          this.categoriesService.getById(categoryId),
          this.motorInsurancesService.getById(motorInsuranceId)
        ]).pipe(
          map(([motorRequest, category, motorInsurance]) => ({
            motorRequest,
            category,
            motorInsurance
          }))
        );
      })
    );
  }
}