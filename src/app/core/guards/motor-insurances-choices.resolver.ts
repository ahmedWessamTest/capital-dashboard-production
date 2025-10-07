import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable, tap, catchError, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';
import { MotorInsurancesService } from '../../pages/dashboard/dashboard-pages/motor-insurance/services/motor-insurance.service';
import { MotorInsuranceChoicesListResponse, MotorInsuranceChoiceResponse, MotorInsuranceChoicesService } from '../../pages/dashboard/dashboard-pages/motor-insurances-choices/services/motor-insurances-choices.service';

@Injectable({
  providedIn: 'root'
})
export class MotorInsuranceChoicesResolver implements Resolve<MotorInsuranceChoicesListResponse | MotorInsuranceChoiceResponse> {
  constructor(
    private motorInsuranceChoicesService: MotorInsuranceChoicesService,
    private motorInsurancesService: MotorInsurancesService,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MotorInsuranceChoicesListResponse | MotorInsuranceChoiceResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    const choiceId = route.paramMap.get('choiceId');
    const isViewOrEditRoute = route.routeConfig?.path?.includes('view-motor-insurances-choices') || 
                             route.routeConfig?.path?.includes('edit-motor-insurances-choices');

    if (choiceId) {
      return this.motorInsuranceChoicesService.getById(+choiceId).pipe(
        tap((response) => console.log('Single motor insurance choice request initiated', response)),
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
      return this.motorInsuranceChoicesService.getAll().pipe(
        tap((response) => console.log('All motor insurance choices request initiated', response)),
        map((response) => {
          if (!response?.data) {
            console.warn('No data in response');
            return response;
          }
          response.data = response.data.filter(choice => choice.motor_insurance_id === +id!);
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
      return this.motorInsuranceChoicesService.getAll().pipe(
        tap((response) => console.log('All motor insurance choices request initiated', response)),
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