import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable, tap, catchError, throwError } from 'rxjs';
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
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MedicalLeadsListResponse | MedicalLeadResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    
    console.log('Resolver called with id:', id);

    if (id) {
      console.log('Fetching single medical lead with id:', id);
      
      return this.medicalLeadsService.getById(+id).pipe(
        tap((response) => {
          console.log('Single medical lead raw response:', response);
        }),
        map((response) => {
          // Transform single item data
          if (response?.data) {
            response.data.active_status = this.normalizeActiveStatusService.normalizeActiveStatus(response.data.active_status);
            response.data.need_call = response.data.need_call?.toLowerCase() === 'yes' ? 'yes' : 'no';
            console.log('Transformed single medical lead:', response.data);
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
    console.log('Fetching all medical leads');
    return this.medicalLeadsService.getAll().pipe(
      tap((response) => {
        console.log('All medical leads request initiated');
        console.log('Raw response:', response);
      }),
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

        console.log('Transformed medical leads data:');
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