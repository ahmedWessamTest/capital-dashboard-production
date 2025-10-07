import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable, tap, catchError, throwError, of } from 'rxjs';
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
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MedicalInsuranceChoicesListResponse | MedicalInsuranceChoiceResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    const choiceId = route.paramMap.get('choiceId');
    const isViewOrEditRoute = route.routeConfig?.path?.includes('view-medical-insurances-choices') || 
                             route.routeConfig?.path?.includes('edit-medical-insurances-choices');

    console.log('Resolver called with route:', route.routeConfig?.path);
    console.log('ID:', id);
    console.log('choiceId:', choiceId);
    console.log('Is view/edit route:', isViewOrEditRoute);

    if (choiceId) {
      // Handle single choice
      console.log('Fetching single medical insurance choice:', choiceId);
      return this.medicalInsuranceChoicesService.getById(+choiceId).pipe(
        tap((response) => {
          console.log('Single medical insurance choice request initiated');
          console.log('Raw response:', response);
        }),
        map((response) => {
          if (!response?.data) {
            console.warn('No data in response');
            return response;
          }

          // Normalize active status for the choice
          response.data.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(response.data.active_status);

          console.log('Transformed medical insurance choice data:');
          console.log(response.data);
          return response;
        }),
        catchError(err => {
          console.error('Error in resolver:', err);
          this.ngxSpinnerService.hide('actionsLoader');
          return throwError(() => err);
        })
      );
    }
    else if(id){
    ``
        // Handle list of choices filtered by medical insurance ID
        console.log('Fetching all medical insurance choices filtered by medical insurance ID:', id);
        return this.medicalInsuranceChoicesService.getAll().pipe(
          tap((response) => {
            console.log('All medical insurance choices request initiated');
            console.log('Raw response:', response);
          }),
          map((response) => {
            if (!response?.data) {
              console.warn('No data in response');
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
  
            console.log('Filtered and transformed medical insurance choices data:');
            console.table(response.data);
            return response;
          }),
          catchError(err => {
            console.error('Error in resolver:', err);
            this.ngxSpinnerService.hide('actionsLoader');
            return throwError(() => err);
          })
        );
    } 
    
    else  {
      // Handle list of choices
      console.log('Fetching all medical insurance choices');
      return this.medicalInsuranceChoicesService.getAll().pipe(
        tap((response) => {
          console.log('All medical insurance choices request initiated');
          console.log('Raw response:', response);
        }),
        map((response) => {
          if (!response?.data) {
            console.warn('No data in response');
            return response;
          }

          // Normalize active status for each choice
          response.data.forEach((choice) => {
            choice.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(choice.active_status);
          });

          console.log('Transformed medical insurance choices data:');
          console.table(response.data);
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