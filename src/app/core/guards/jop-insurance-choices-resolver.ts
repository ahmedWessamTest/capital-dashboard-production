import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IAllJopPolicy } from '../../pages/dashboard/dashboard-pages/a-jop-insurance/jop-insurance';
import { JopInsuranceService } from '../../pages/dashboard/dashboard-pages/a-jop-insurance/jop-insurance.service';

export const jopInsuranceChoicesResolver: ResolveFn<any> = (
  route,
  state
): Observable<any> => {
  const jopInsuranceService = inject(JopInsuranceService);

  return jopInsuranceService.getAll().pipe(
    map((response: IAllJopPolicy) => {
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message,
        };
      } else {
        throw new Error(
          response.message || 'Failed to load Professional insurances'
        );
      }
    }),
    catchError((error) => {
      console.error('Error loading Professional insurances:', error);
      return of({
        success: false,
        data: [],
        message: error.message || 'Failed to load Professional insurances',
      });
    })
  );
};
