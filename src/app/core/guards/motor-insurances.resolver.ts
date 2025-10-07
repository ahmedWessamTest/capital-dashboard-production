import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';
import { MotorInsuranceResponse, MotorInsurancesListResponse, MotorInsurancesService } from '../../pages/dashboard/dashboard-pages/motor-insurance/services/motor-insurance.service';

@Injectable({
  providedIn: 'root'
})
export class MotorInsurancesResolver implements Resolve<MotorInsurancesListResponse | MotorInsuranceResponse> {
  constructor(
    private service: MotorInsurancesService,
    private spinner: NgxSpinnerService,
    private statusNormalizer: NormalizeActiveStatusService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MotorInsurancesListResponse | MotorInsuranceResponse> {
    this.spinner.show('actionsLoader');
    const insuranceId = route.paramMap.get('id');

    if (insuranceId) {
      return this.service.getById(+insuranceId).pipe(
        map(response => this.normalizeInsurance(response)),
        catchError(err => this.handleError(err)),
        finalize(() => this.spinner.hide('actionsLoader'))
      );
    }

    return this.service.getAll().pipe(
      map(response => this.normalizeInsurances(response)),
      catchError(err => this.handleError(err)),
      finalize(() => this.spinner.hide('actionsLoader'))
    );
  }

  private normalizeInsurance(response: MotorInsuranceResponse): MotorInsuranceResponse {
    if (response?.data) {
      response.data.active_status = this.statusNormalizer.normalizeActiveStatus(response.data.active_status);
    }
    return response;
  }

  private normalizeInsurances(response: MotorInsurancesListResponse): MotorInsurancesListResponse {
    if (response?.data) {
      response.data.forEach(insurance => {
        insurance.active_status = this.statusNormalizer.normalizeActiveStatus(insurance.active_status);
      });
    }
    return response;
  }

  private handleError(err: any): Observable<never> {
    console.error('Resolver error:', err);
    return throwError(() => err);
  }
}