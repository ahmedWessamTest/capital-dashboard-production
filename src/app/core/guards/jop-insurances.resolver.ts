import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';
import {
  IAllJopPolicy,
  IJopPolicyResponseForId,
} from '../../pages/dashboard/dashboard-pages/a-jop-insurance/jop-insurance';
import { JopInsuranceService } from '../../pages/dashboard/dashboard-pages/a-jop-insurance/jop-insurance.service';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';

@Injectable({
  providedIn: 'root',
})
export class JopInsurancesResolver
  implements Resolve<IAllJopPolicy | IJopPolicyResponseForId>
{
  constructor(
    private service: JopInsuranceService,
    private spinner: NgxSpinnerService,
    private statusNormalizer: NormalizeActiveStatusService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<IAllJopPolicy | IJopPolicyResponseForId> {
    this.spinner.show('actionsLoader');
    const insuranceId = route.paramMap.get('id');

    if (insuranceId) {
      return this.service.getById(+insuranceId).pipe(
        map((response) => {
          // Convert IJopPolicy to IJopPolicyResponseForId format
          const formattedResponse: IJopPolicyResponseForId = {
            success: true,
            message: 'Success',
            data: response,
          };
          return this.normalizeInsurance(formattedResponse);
        }),
        catchError((err) => this.handleError(err)),
        finalize(() => this.spinner.hide('actionsLoader'))
      );
    }

    return this.service.getAll().pipe(
      map((response) => this.normalizeInsurances(response)),
      catchError((err) => this.handleError(err)),
      finalize(() => this.spinner.hide('actionsLoader'))
    );
  }

  private normalizeInsurance(
    response: IJopPolicyResponseForId
  ): IJopPolicyResponseForId {
    if (response?.data) {
      response.data.active_status = this.statusNormalizer.normalizeActiveStatus(
        response.data.active_status
      ) as any;
    }
    return response;
  }

  private normalizeInsurances(response: IAllJopPolicy): IAllJopPolicy {
    if (response?.data) {
      response.data.forEach((insurance) => {
        insurance.active_status = this.statusNormalizer.normalizeActiveStatus(
          insurance.active_status
        ) as any;
      });
    }
    return response;
  }

  private handleError(err: any): Observable<never> {
    console.error('Resolver error:', err);
    return throwError(() => err);
  }
}
