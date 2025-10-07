import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, finalize, map, tap, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';
import { MedicalInsurancesListResponse, MedicalInsuranceResponse, MedicalInsurancesService } from '../../pages/dashboard/dashboard-pages/medical-insurances/services/medical-insurances.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalInsurancesResolver implements Resolve<MedicalInsurancesListResponse | MedicalInsuranceResponse> {
  constructor(
    private service: MedicalInsurancesService,
    private spinner: NgxSpinnerService,
    private statusNormalizer: NormalizeActiveStatusService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MedicalInsurancesListResponse | MedicalInsuranceResponse> {
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

  private normalizeInsurance(response: MedicalInsuranceResponse): MedicalInsuranceResponse {
    if (response?.data) {
      response.data.active_status = this.statusNormalizer.normalizeActiveStatus(response.data.active_status);
    }
    return response;
  }

  private normalizeInsurances(response: MedicalInsurancesListResponse): MedicalInsurancesListResponse {
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