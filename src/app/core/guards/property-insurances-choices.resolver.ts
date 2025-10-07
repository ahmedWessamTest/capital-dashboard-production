import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable, tap, catchError, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';
import { BuildingInsurancesService } from '../../pages/dashboard/dashboard-pages/property-insurance/services/property-insurance.service';
import { BuildingInsuranceChoicesListResponse, BuildingInsuranceChoiceResponse, BuildingInsuranceChoicesService } from '../../pages/dashboard/dashboard-pages/property-insurances-choices/services/property-insurances-choices.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyInsuranceChoicesResolver implements Resolve<BuildingInsuranceChoicesListResponse | BuildingInsuranceChoiceResponse> {
  constructor(
    private buildingInsuranceChoicesService: BuildingInsuranceChoicesService,
    private buildingInsurancesService: BuildingInsurancesService,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BuildingInsuranceChoicesListResponse | BuildingInsuranceChoiceResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    const choiceId = route.paramMap.get('choiceId');
    const isViewOrEditRoute = route.routeConfig?.path?.includes('view-building-insurance-choices') || 
                             route.routeConfig?.path?.includes('edit-building-insurance-choices');

    if (choiceId) {
      return this.buildingInsuranceChoicesService.getById(+choiceId).pipe(
        tap((response) => console.log('Single building insurance choice request initiated', response)),
        map((response) => {
          if (!response?.data) {
            console.warn('No data in response');
            return response;
          }
          response.data.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(response.data.active_status);
          return response;
        }),
        catchError(err => {
          console.error('Error in resolver:', err);
          this.ngxSpinnerService.hide('actionsLoader');
          return throwError(() => err);
        })
      );
    } else if (id) {
      return this.buildingInsuranceChoicesService.getAll().pipe(
        tap((response) => console.log('All building insurance choices request initiated', response)),
        map((response) => {
          if (!response?.data) {
            console.warn('No data in response');
            return response;
          }
          response.data = response.data.filter(choice => choice.building_insurance_id === +id!);
          response.data.forEach((choice) => {
            choice.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(choice.active_status);
          });
          return response;
        }),
        catchError(err => {
          console.error('Error in resolver:', err);
          this.ngxSpinnerService.hide('actionsLoader');
          return throwError(() => err);
        })
      );
    } else {
      return this.buildingInsuranceChoicesService.getAll().pipe(
        tap((response) => console.log('All building insurance choices request initiated', response)),
        map((response) => {
          if (!response?.data) {
            console.warn('No data in response');
            return response;
          }
          response.data.forEach((choice) => {
            choice.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(choice.active_status);
          });
          return response;
        }),
        catchError(err => {
          console.error('Error in resolver:', err);
          this.ngxSpinnerService.hide('actionsLoader');
          return throwError(() => err);
        })
      );
    }
  }
}