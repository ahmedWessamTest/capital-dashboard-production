import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable, catchError, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';
import {
  MedicalInsuranceChoicesListResponse,
  MedicalInsuranceChoiceResponse,
  MedicalInsuranceChoicesService
} from '../../pages/dashboard/dashboard-pages/medical-insurances-choices/services/medical-insurances-choices.service';
import { MedicalInsurancesService } from '../../pages/dashboard/dashboard-pages/medical-insurances/services/medical-insurances.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalInsuranceChoicesResolver implements Resolve<MedicalInsuranceChoicesListResponse | MedicalInsuranceChoiceResponse> {
  constructor(
    private medicalInsuranceChoicesService: MedicalInsuranceChoicesService,
    private medicalInsurancesService: MedicalInsurancesService,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MedicalInsuranceChoicesListResponse | MedicalInsuranceChoiceResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    const choiceId = route.paramMap.get('choiceId');
    if (choiceId) {
      // Handle single choice
      return this.medicalInsuranceChoicesService.getById(+choiceId).pipe(

        map((response) => {
          if (!response?.data) {
            return response;
          }

          // Normalize active status for the choice
          response.data.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(response.data.active_status);

          return response;
        }),
        catchError(err => {
          console.error('Error in resolver:', err);
          this.ngxSpinnerService.hide('actionsLoader');
          return throwError(() => err);
        })
      );
    }
    else if (id) {
      ``
      // Handle list of choices filtered by medical insurance ID
      return this.medicalInsuranceChoicesService.getAll().pipe(
        map((response) => {
          if (!response?.data) {
            return response;
          }

          // Filter choices by medical insurance ID
          response.data = response.data.filter(choice =>
            choice.medical_insurance_id === +id!
          );

          // Normalize active status for each choice
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

    else {
      // Handle list of choices
      return this.medicalInsuranceChoicesService.getAll().pipe(
        map((response) => {
          if (!response?.data) {
            console.warn('No data in response');
            return response;
          }

          // Normalize active status for each choice
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