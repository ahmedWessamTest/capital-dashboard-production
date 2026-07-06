import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable, catchError, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MedicalLeadResponse, MedicalLeadsListResponse, MedicalLeadsService } from '../../pages/dashboard/dashboard-pages/medical-leads/services/medical-leads.service';
import { NormalizeActiveStatusService } from '../normalize-active-status/normalize-active-status.service';

@Injectable({
  providedIn: 'root'
})
export class medicalLeadsResolver implements Resolve<MedicalLeadsListResponse | MedicalLeadResponse> {
  constructor(
    private medicalLeadsService: MedicalLeadsService,
    private ngxSpinnerService: NgxSpinnerService,
    private normalizeActiveStatusService: NormalizeActiveStatusService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MedicalLeadsListResponse | MedicalLeadResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');


    if (id) {

      return this.medicalLeadsService.getById(+id).pipe(
        map((response) => {
          // Transform single item data
          if (response?.data) {
            response.data.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(response.data.active_status);
            response.data.need_call = response.data.need_call?.toLowerCase() === 'yes' ? 'yes' : 'no';
          }
          return response;
        }),
        catchError(err => {
          console.error('Error fetching single medical lead:', err);
          this.ngxSpinnerService.hide('actionsLoader');
          return throwError(() => err);
        })
      );
    }

    // Handle list case
    return this.medicalLeadsService.getAll().pipe(

      map((response) => {
        if (!response?.data) {
          console.warn('No data in response');
          return response;
        }

        // Transform each item in the list
        response.data.forEach((lead) => {
          lead.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(lead.active_status);
          lead.need_call = lead.need_call?.toLowerCase() === 'yes' ? 'yes' : 'no';
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