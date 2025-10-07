import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { JopInsuranceService } from '../../pages/dashboard/dashboard-pages/a-jop-insurance/jop-insurance.service';
import {
  JopInsuranceChoiceResponse,
  JopInsuranceChoicesListResponse,
  JopInsuranceChoicesService,
} from '../../pages/dashboard/dashboard-pages/jop-insurances-choices/services/jop-insurances-choices.service';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';

@Injectable({
  providedIn: 'root',
})
export class JopInsuranceChoicesResolver
  implements
    Resolve<JopInsuranceChoicesListResponse | JopInsuranceChoiceResponse>
{
  constructor(
    private jopInsuranceChoicesService: JopInsuranceChoicesService,
    private jopInsuranceService: JopInsuranceService,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<JopInsuranceChoicesListResponse | JopInsuranceChoiceResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    const choiceId = route.paramMap.get('choiceId');
    const isViewOrEditRoute =
      route.routeConfig?.path?.includes('view-jop-insurance-choices') ||
      route.routeConfig?.path?.includes('edit-jop-insurance-choices');

    if (choiceId) {
      return this.jopInsuranceChoicesService.getById(+choiceId).pipe(
        tap((response) =>
          console.log('Single job insurance choice request initiated', response)
        ),
        map((response) => {
          if (!response?.data) {
            console.warn('No data in response');
            return response;
          }
          response.data.active_status =
            this.normalizeActiveStatusService.normalizeActiveStatus(
              response.data.active_status
            );
          return response;
        }),
        catchError((err) => {
          console.error('Error in resolver:', err);
          this.ngxSpinnerService.hide('actionsLoader');
          return throwError(() => err);
        })
      );
    } else if (id) {
      return this.jopInsuranceChoicesService.getAll().pipe(
        tap((response) =>
          console.log('All job insurance choices request initiated', response)
        ),
        map((response) => {
          if (!response?.data) {
            console.warn('No data in response');
            return response;
          }
          response.data = response.data.filter(
            (choice) => choice.jop_insurance_id === +id!
          );
          response.data.forEach((choice) => {
            choice.active_status =
              this.normalizeActiveStatusService.normalizeActiveStatus(
                choice.active_status
              );
          });
          return response;
        }),
        catchError((err) => {
          console.error('Error in resolver:', err);
          this.ngxSpinnerService.hide('actionsLoader');
          return throwError(() => err);
        })
      );
    } else {
      return this.jopInsuranceChoicesService.getAll().pipe(
        tap((response) =>
          console.log('All job insurance choices request initiated', response)
        ),
        map((response) => {
          if (!response?.data) {
            console.warn('No data in response');
            return response;
          }
          response.data.forEach((choice) => {
            choice.active_status =
              this.normalizeActiveStatusService.normalizeActiveStatus(
                choice.active_status
              );
          });
          return response;
        }),
        catchError((err) => {
          console.error('Error in resolver:', err);
          this.ngxSpinnerService.hide('actionsLoader');
          return throwError(() => err);
        })
      );
    }
  }
}
